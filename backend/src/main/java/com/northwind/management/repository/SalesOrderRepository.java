package com.northwind.management.repository;

import com.northwind.management.entity.DeliveryStatus;
import com.northwind.management.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Integer> {

    List<SalesOrder> findByDeliveryStatusOrderByOrderDateDesc(DeliveryStatus deliveryStatus);

    List<SalesOrder> findByCustIdOrderByOrderDateDesc(Integer custId);

    List<SalesOrder> findByEmployeeIdOrderByOrderDateDesc(Integer employeeId);

    List<SalesOrder> findAllByOrderByOrderDateDesc();

    long countByDeliveryStatus(DeliveryStatus deliveryStatus);

    @Query("SELECT o FROM SalesOrder o WHERE " +
           "(:status IS NULL OR o.deliveryStatus = :status) AND " +
           "(:search IS NULL OR LOWER(o.shipName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.shipCity) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.shipCountry) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "CAST(o.orderId AS string) LIKE CONCAT('%', :search, '%')) " +
           "ORDER BY o.orderDate DESC")
    List<SalesOrder> searchOrders(@Param("status") DeliveryStatus status, @Param("search") String search);

    @Query("SELECT SUM(od.unitPrice * od.quantity * (1 - od.discount)) FROM OrderDetail od")
    Double calculateTotalRevenue();
}
