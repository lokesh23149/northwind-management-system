package com.northwind.management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productId")
    private Integer productId;

    @Column(name = "productName", nullable = false, length = 40)
    private String productName;

    @Column(name = "supplierId")
    private Integer supplierId;

    @Column(name = "categoryId")
    private Integer categoryId;

    @Column(name = "quantityPerUnit", length = 20)
    private String quantityPerUnit;

    @Column(name = "unitPrice", precision = 10, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "unitsInStock")
    private Short unitsInStock = 0;

    @Column(name = "unitsOnOrder")
    private Short unitsOnOrder = 0;

    @Column(name = "reorderLevel")
    private Short reorderLevel = 0;

    @Column(name = "discontinued", nullable = false, length = 1)
    private String discontinued = "0";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplierId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Supplier supplier;

    public Product() {
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId) {
        this.supplierId = supplierId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getQuantityPerUnit() {
        return quantityPerUnit;
    }

    public void setQuantityPerUnit(String quantityPerUnit) {
        this.quantityPerUnit = quantityPerUnit;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice != null ? unitPrice : BigDecimal.ZERO;
    }

    public Short getUnitsInStock() {
        return unitsInStock;
    }

    public void setUnitsInStock(Short unitsInStock) {
        this.unitsInStock = unitsInStock != null ? unitsInStock : 0;
    }

    public Short getUnitsOnOrder() {
        return unitsOnOrder;
    }

    public void setUnitsOnOrder(Short unitsOnOrder) {
        this.unitsOnOrder = unitsOnOrder != null ? unitsOnOrder : 0;
    }

    public Short getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Short reorderLevel) {
        this.reorderLevel = reorderLevel != null ? reorderLevel : 0;
    }

    public String getDiscontinued() {
        return discontinued;
    }

    public void setDiscontinued(String discontinued) {
        this.discontinued = discontinued != null ? discontinued : "0";
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public boolean isDiscontinuedBoolean() {
        return "1".equals(this.discontinued) || "Y".equalsIgnoreCase(this.discontinued) || "true".equalsIgnoreCase(this.discontinued);
    }

    public boolean isLowStock() {
        return this.unitsInStock != null && this.reorderLevel != null && this.unitsInStock <= this.reorderLevel;
    }
}
