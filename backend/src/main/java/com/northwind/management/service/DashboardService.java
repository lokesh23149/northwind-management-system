package com.northwind.management.service;

import com.northwind.management.dto.DashboardStatsDto;
import com.northwind.management.entity.DeliveryStatus;
import com.northwind.management.repository.CustomerRepository;
import com.northwind.management.repository.EmployeeRepository;
import com.northwind.management.repository.ProductRepository;
import com.northwind.management.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SalesOrderRepository salesOrderRepository;

    public DashboardService(EmployeeRepository employeeRepository,
                            ProductRepository productRepository,
                            CustomerRepository customerRepository,
                            SalesOrderRepository salesOrderRepository) {
        this.employeeRepository = employeeRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalEmployees(employeeRepository.count());
        stats.setTotalProducts(productRepository.count());
        stats.setTotalCustomers(customerRepository.count());
        stats.setTotalOrders(salesOrderRepository.count());

        stats.setPendingDeliveries(salesOrderRepository.countByDeliveryStatus(DeliveryStatus.PENDING));
        stats.setShippedDeliveries(salesOrderRepository.countByDeliveryStatus(DeliveryStatus.SHIPPED));
        stats.setDeliveredDeliveries(salesOrderRepository.countByDeliveryStatus(DeliveryStatus.DELIVERED));
        stats.setLowStockProducts(productRepository.countLowStockProducts());

        Double rev = salesOrderRepository.calculateTotalRevenue();
        stats.setTotalRevenue(rev != null ? BigDecimal.valueOf(rev).setScale(2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO);

        return stats;
    }
}
