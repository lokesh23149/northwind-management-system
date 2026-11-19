package com.northwind.management.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {

    private long totalEmployees;
    private long totalProducts;
    private long totalCustomers;
    private long totalOrders;
    private long pendingDeliveries;
    private long shippedDeliveries;
    private long deliveredDeliveries;
    private long lowStockProducts;
    private BigDecimal totalRevenue;

    public DashboardStatsDto() {
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingDeliveries() {
        return pendingDeliveries;
    }

    public void setPendingDeliveries(long pendingDeliveries) {
        this.pendingDeliveries = pendingDeliveries;
    }

    public long getShippedDeliveries() {
        return shippedDeliveries;
    }

    public void setShippedDeliveries(long shippedDeliveries) {
        this.shippedDeliveries = shippedDeliveries;
    }

    public long getDeliveredDeliveries() {
        return deliveredDeliveries;
    }

    public void setDeliveredDeliveries(long deliveredDeliveries) {
        this.deliveredDeliveries = deliveredDeliveries;
    }

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
