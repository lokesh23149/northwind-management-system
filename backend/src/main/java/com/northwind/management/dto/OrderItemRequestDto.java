package com.northwind.management.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class OrderItemRequestDto {

    @NotNull(message = "Product ID is required")
    private Integer productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Short quantity = 1;

    @DecimalMin(value = "0.0", inclusive = true, message = "Unit price must be non-negative")
    private BigDecimal unitPrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount cannot be negative")
    @DecimalMax(value = "1.0", inclusive = true, message = "Discount cannot exceed 100% (1.0)")
    private BigDecimal discount = BigDecimal.ZERO;

    public OrderItemRequestDto() {
    }

    public OrderItemRequestDto(Integer productId, Short quantity, BigDecimal unitPrice, BigDecimal discount) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.discount = discount != null ? discount : BigDecimal.ZERO;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Short getQuantity() {
        return quantity;
    }

    public void setQuantity(Short quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount != null ? discount : BigDecimal.ZERO;
    }
}
