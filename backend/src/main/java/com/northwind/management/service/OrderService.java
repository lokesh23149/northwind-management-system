package com.northwind.management.service;

import com.northwind.management.dto.OrderItemRequestDto;
import com.northwind.management.dto.OrderItemResponseDto;
import com.northwind.management.dto.OrderRequestDto;
import com.northwind.management.dto.OrderResponseDto;
import com.northwind.management.entity.*;
import com.northwind.management.exception.BadRequestException;
import com.northwind.management.exception.InsufficientStockException;
import com.northwind.management.exception.ResourceNotFoundException;
import com.northwind.management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final ShipperRepository shipperRepository;
    private final ProductRepository productRepository;

    public OrderService(SalesOrderRepository salesOrderRepository,
                        OrderDetailRepository orderDetailRepository,
                        CustomerRepository customerRepository,
                        EmployeeRepository employeeRepository,
                        ShipperRepository shipperRepository,
                        ProductRepository productRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.shipperRepository = shipperRepository;
        this.productRepository = productRepository;
    }

    /**
     * Create an order with multiple products, atomic stock deduction,
     * calculation of totals, and initial PENDING delivery status.
     */
    public OrderResponseDto createOrder(OrderRequestDto request) {
        // 1. Validate Customer
        Customer customer = customerRepository.findById(request.getCustId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "custId", request.getCustId()));

        // 2. Validate Shipper
        Shipper shipper = shipperRepository.findById(request.getShipperId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipper", "shipperId", request.getShipperId()));

        // 3. Optional Employee validation
        Employee employee = null;
        if (request.getEmployeeId() != null) {
            employee = employeeRepository.findById(request.getEmployeeId()).orElse(null);
        }

        // 4. Create SalesOrder entity
        SalesOrder order = new SalesOrder();
        order.setCustId(customer.getCustId());
        order.setCustomer(customer);
        if (employee != null) {
            order.setEmployeeId(employee.getEmployeeId());
            order.setEmployee(employee);
        }
        order.setShipperId(shipper.getShipperId());
        order.setShipper(shipper);

        order.setOrderDate(LocalDateTime.now());
        order.setRequiredDate(request.getRequiredDate() != null ? request.getRequiredDate() : LocalDateTime.now().plusDays(7));
        order.setShippedDate(null);
        order.setDeliveryStatus(DeliveryStatus.PENDING);
        order.setFreight(request.getFreight() != null ? request.getFreight() : BigDecimal.ZERO);

        // Shipping details (default to customer address if not provided)
        order.setShipName(request.getShipName() != null ? request.getShipName() : customer.getCompanyName());
        order.setShipAddress(request.getShipAddress() != null ? request.getShipAddress() : customer.getAddress());
        order.setShipCity(request.getShipCity() != null ? request.getShipCity() : customer.getCity());
        order.setShipRegion(request.getShipRegion() != null ? request.getShipRegion() : customer.getRegion());
        order.setShipPostalCode(request.getShipPostalCode() != null ? request.getShipPostalCode() : customer.getPostalCode());
        order.setShipCountry(request.getShipCountry() != null ? request.getShipCountry() : customer.getCountry());

        // 5. Save SalesOrder to obtain generated orderId
        SalesOrder savedOrder = salesOrderRepository.save(order);

        // 6. Process items and check/deduct stock
        List<OrderDetail> details = new ArrayList<>();
        for (OrderItemRequestDto itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", itemReq.getProductId()));

            if (product.isDiscontinuedBoolean()) {
                throw new BadRequestException("Product '" + product.getProductName() + "' (ID: " + product.getProductId() + ") is discontinued and cannot be ordered.");
            }

            short reqQty = itemReq.getQuantity() != null ? itemReq.getQuantity() : 1;
            short inStock = product.getUnitsInStock() != null ? product.getUnitsInStock() : 0;

            if (inStock < reqQty) {
                throw new InsufficientStockException(product.getProductId(), product.getProductName(), inStock, reqQty);
            }

            // Atomically decrement product stock
            product.setUnitsInStock((short) (inStock - reqQty));
            productRepository.save(product);

            // Create OrderDetail
            OrderDetail detail = new OrderDetail();
            detail.setOrder(savedOrder);
            detail.setOrderId(savedOrder.getOrderId());
            detail.setProductId(product.getProductId());
            detail.setProduct(product);

            BigDecimal unitPrice = itemReq.getUnitPrice() != null ? itemReq.getUnitPrice() : product.getUnitPrice();
            detail.setUnitPrice(unitPrice != null ? unitPrice : BigDecimal.ZERO);
            detail.setQuantity(reqQty);
            detail.setDiscount(itemReq.getDiscount() != null ? itemReq.getDiscount() : BigDecimal.ZERO);

            OrderDetail savedDetail = orderDetailRepository.save(detail);
            details.add(savedDetail);
        }

        savedOrder.setOrderDetails(details);
        return toDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders(DeliveryStatus status, String search) {
        List<SalesOrder> orders = salesOrderRepository.searchOrders(status, search);
        return orders.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Integer id) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SalesOrder", "orderId", id));
        return toDto(order);
    }

    /**
     * Cancel an order and restore inventory if the order has not been shipped yet.
     */
    public OrderResponseDto cancelOrder(Integer orderId) {
        SalesOrder order = salesOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("SalesOrder", "orderId", orderId));

        if (order.getDeliveryStatus() == DeliveryStatus.DELIVERED) {
            throw new BadRequestException("Order #" + orderId + " has already been delivered and cannot be cancelled.");
        }

        // Restore stock
        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        for (OrderDetail detail : details) {
            productRepository.findById(detail.getProductId()).ifPresent(prod -> {
                short current = prod.getUnitsInStock() != null ? prod.getUnitsInStock() : 0;
                prod.setUnitsInStock((short) (current + detail.getQuantity()));
                productRepository.save(prod);
            });
        }

        orderDetailRepository.deleteAll(details);
        salesOrderRepository.delete(order);

        OrderResponseDto response = new OrderResponseDto();
        response.setOrderId(orderId);
        return response;
    }

    public OrderResponseDto toDto(SalesOrder entity) {
        if (entity == null) return null;
        OrderResponseDto dto = new OrderResponseDto();
        dto.setOrderId(entity.getOrderId());
        dto.setCustId(entity.getCustId());
        if (entity.getCustomer() != null) {
            dto.setCustomerName(entity.getCustomer().getCompanyName());
            dto.setCustomerContact(entity.getCustomer().getContactName());
        }
        dto.setEmployeeId(entity.getEmployeeId());
        if (entity.getEmployee() != null) {
            dto.setEmployeeName(entity.getEmployee().getFullName());
        }
        dto.setShipperId(entity.getShipperId());
        if (entity.getShipper() != null) {
            dto.setShipperName(entity.getShipper().getCompanyName());
        }

        dto.setOrderDate(entity.getOrderDate());
        dto.setRequiredDate(entity.getRequiredDate());
        dto.setShippedDate(entity.getShippedDate());
        dto.setFreight(entity.getFreight() != null ? entity.getFreight() : BigDecimal.ZERO);
        dto.setShipName(entity.getShipName());
        dto.setShipAddress(entity.getShipAddress());
        dto.setShipCity(entity.getShipCity());
        dto.setShipRegion(entity.getShipRegion());
        dto.setShipPostalCode(entity.getShipPostalCode());
        dto.setShipCountry(entity.getShipCountry());
        dto.setDeliveryStatus(entity.getDeliveryStatus());

        List<OrderDetail> details = entity.getOrderDetails();
        if (details == null || details.isEmpty()) {
            details = orderDetailRepository.findByOrderId(entity.getOrderId());
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItemResponseDto> items = new ArrayList<>();
        int totalQty = 0;

        for (OrderDetail d : details) {
            OrderItemResponseDto itemDto = new OrderItemResponseDto();
            itemDto.setOrderDetailId(d.getOrderDetailId());
            itemDto.setProductId(d.getProductId());
            if (d.getProduct() != null) {
                itemDto.setProductName(d.getProduct().getProductName());
                if (d.getProduct().getCategory() != null) {
                    itemDto.setCategoryName(d.getProduct().getCategory().getCategoryName());
                }
            }
            itemDto.setUnitPrice(d.getUnitPrice());
            itemDto.setQuantity(d.getQuantity());
            itemDto.setDiscount(d.getDiscount());

            BigDecimal lineTotal = d.calculateLineTotal();
            itemDto.setLineTotal(lineTotal);
            subtotal = subtotal.add(lineTotal);
            totalQty += (d.getQuantity() != null ? d.getQuantity() : 0);

            items.add(itemDto);
        }

        dto.setItems(items);
        dto.setTotalItems(totalQty);
        dto.setSubtotal(subtotal);
        dto.setGrandTotal(subtotal.add(dto.getFreight()));

        return dto;
    }
}
