package com.northwind.management.exception;

public class InsufficientStockException extends RuntimeException {

    private Integer productId;
    private String productName;
    private Short availableStock;
    private Short requestedQuantity;

    public InsufficientStockException(String message) {
        super(message);
    }

    public InsufficientStockException(Integer productId, String productName, Short availableStock, Short requestedQuantity) {
        super(String.format("Insufficient stock for product '%s' (ID: %d). Available: %d, Requested: %d",
                productName, productId, availableStock, requestedQuantity));
        this.productId = productId;
        this.productName = productName;
        this.availableStock = availableStock;
        this.requestedQuantity = requestedQuantity;
    }

    public Integer getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public Short getAvailableStock() {
        return availableStock;
    }

    public Short getRequestedQuantity() {
        return requestedQuantity;
    }
}
