package com.northwind.management.service;

import com.northwind.management.dto.DeliveryUpdateDto;
import com.northwind.management.dto.OrderResponseDto;
import com.northwind.management.entity.DeliveryStatus;
import com.northwind.management.entity.SalesOrder;
import com.northwind.management.entity.Shipper;
import com.northwind.management.exception.ResourceNotFoundException;
import com.northwind.management.repository.SalesOrderRepository;
import com.northwind.management.repository.ShipperRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeliveryService {

    private final SalesOrderRepository salesOrderRepository;
    private final ShipperRepository shipperRepository;
    private final OrderService orderService;

    public DeliveryService(SalesOrderRepository salesOrderRepository,
                           ShipperRepository shipperRepository,
                           OrderService orderService) {
        this.salesOrderRepository = salesOrderRepository;
        this.shipperRepository = shipperRepository;
        this.orderService = orderService;
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllDeliveries(DeliveryStatus status, String search) {
        List<SalesOrder> orders = salesOrderRepository.searchOrders(status, search);
        return orders.stream().map(orderService::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDto getDeliveryById(Integer orderId) {
        SalesOrder order = salesOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery/Order", "orderId", orderId));
        return orderService.toDto(order);
    }

    public OrderResponseDto updateDeliveryStatus(Integer orderId, DeliveryUpdateDto dto) {
        SalesOrder order = salesOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery/Order", "orderId", orderId));

        DeliveryStatus oldStatus = order.getDeliveryStatus();
        DeliveryStatus newStatus = dto.getDeliveryStatus();

        order.setDeliveryStatus(newStatus);

        // State Transition Handling
        if (newStatus == DeliveryStatus.SHIPPED) {
            if (dto.getShippedDate() != null) {
                order.setShippedDate(dto.getShippedDate());
            } else if (order.getShippedDate() == null) {
                order.setShippedDate(LocalDateTime.now());
            }
        } else if (newStatus == DeliveryStatus.PENDING) {
            order.setShippedDate(null);
        } else if (newStatus == DeliveryStatus.DELIVERED) {
            if (order.getShippedDate() == null) {
                order.setShippedDate(LocalDateTime.now());
            }
        }

        // Optional shipping updates
        if (dto.getShipAddress() != null && !dto.getShipAddress().trim().isEmpty()) {
            order.setShipAddress(dto.getShipAddress().trim());
        }
        if (dto.getShipCity() != null && !dto.getShipCity().trim().isEmpty()) {
            order.setShipCity(dto.getShipCity().trim());
        }
        if (dto.getShipCountry() != null && !dto.getShipCountry().trim().isEmpty()) {
            order.setShipCountry(dto.getShipCountry().trim());
        }
        if (dto.getShipperId() != null) {
            Shipper shipper = shipperRepository.findById(dto.getShipperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipper", "shipperId", dto.getShipperId()));
            order.setShipperId(shipper.getShipperId());
            order.setShipper(shipper);
        }

        SalesOrder updated = salesOrderRepository.save(order);
        return orderService.toDto(updated);
    }
}
