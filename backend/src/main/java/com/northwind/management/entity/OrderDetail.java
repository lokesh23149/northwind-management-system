package com.northwind.management.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "OrderDetail")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderDetailId")
    private Integer orderDetailId;

    @Column(name = "orderId", insertable = false, updatable = false)
    private Integer orderId;

    @Column(name = "productId")
    private Integer productId;

    @Column(name = "unitPrice", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "quantity", nullable = false)
    private Short quantity = 1;

    @Column(name = "discount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId", nullable = false)
    @JsonBackReference
    private SalesOrder order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "productId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    public OrderDetail() {
    }

    public Integer getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Integer orderDetailId) {
        this.orderDetailId = orderDetailId;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice != null ? unitPrice : BigDecimal.ZERO;
    }

    public Short getQuantity() {
        return quantity;
    }

    public void setQuantity(Short quantity) {
        this.quantity = quantity != null ? quantity : 1;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount != null ? discount : BigDecimal.ZERO;
    }

    public SalesOrder getOrder() {
        return order;
    }

    public void setOrder(SalesOrder order) {
        this.order = order;
        if (order != null) {
            this.orderId = order.getOrderId();
        }
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public BigDecimal calculateLineTotal() {
        BigDecimal qty = BigDecimal.valueOf(quantity != null ? quantity : 0);
        BigDecimal price = unitPrice != null ? unitPrice : BigDecimal.ZERO;
        BigDecimal disc = discount != null ? discount : BigDecimal.ZERO;

        BigDecimal base = price.multiply(qty);
        BigDecimal discountFactor = BigDecimal.ONE.subtract(disc);
        return base.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);
    }
}
