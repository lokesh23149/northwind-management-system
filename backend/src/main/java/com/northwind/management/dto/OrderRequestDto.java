package com.northwind.management.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderRequestDto {

    @NotNull(message = "Customer ID is required")
    private Integer custId;

    private Integer employeeId;

    @NotNull(message = "Shipper ID is required")
    private Integer shipperId;

    private LocalDateTime requiredDate;

    @DecimalMin(value = "0.0", inclusive = true, message = "Freight cannot be negative")
    private BigDecimal freight = BigDecimal.ZERO;

    @Size(max = 40, message = "Ship name cannot exceed 40 characters")
    private String shipName;

    @Size(max = 60, message = "Ship address cannot exceed 60 characters")
    private String shipAddress;

    @Size(max = 15, message = "Ship city cannot exceed 15 characters")
    private String shipCity;

    @Size(max = 15, message = "Ship region cannot exceed 15 characters")
    private String shipRegion;

    @Size(max = 10, message = "Ship postal code cannot exceed 10 characters")
    private String shipPostalCode;

    @Size(max = 15, message = "Ship country cannot exceed 15 characters")
    private String shipCountry;

    @NotEmpty(message = "At least one product item is required in the order")
    @Valid
    private List<OrderItemRequestDto> items = new ArrayList<>();

    public OrderRequestDto() {
    }

    public Integer getCustId() {
        return custId;
    }

    public void setCustId(Integer custId) {
        this.custId = custId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getShipperId() {
        return shipperId;
    }

    public void setShipperId(Integer shipperId) {
        this.shipperId = shipperId;
    }

    public LocalDateTime getRequiredDate() {
        return requiredDate;
    }

    public void setRequiredDate(LocalDateTime requiredDate) {
        this.requiredDate = requiredDate;
    }

    public BigDecimal getFreight() {
        return freight;
    }

    public void setFreight(BigDecimal freight) {
        this.freight = freight != null ? freight : BigDecimal.ZERO;
    }

    public String getShipName() {
        return shipName;
    }

    public void setShipName(String shipName) {
        this.shipName = shipName;
    }

    public String getShipAddress() {
        return shipAddress;
    }

    public void setShipAddress(String shipAddress) {
        this.shipAddress = shipAddress;
    }

    public String getShipCity() {
        return shipCity;
    }

    public void setShipCity(String shipCity) {
        this.shipCity = shipCity;
    }

    public String getShipRegion() {
        return shipRegion;
    }

    public void setShipRegion(String shipRegion) {
        this.shipRegion = shipRegion;
    }

    public String getShipPostalCode() {
        return shipPostalCode;
    }

    public void setShipPostalCode(String shipPostalCode) {
        this.shipPostalCode = shipPostalCode;
    }

    public String getShipCountry() {
        return shipCountry;
    }

    public void setShipCountry(String shipCountry) {
        this.shipCountry = shipCountry;
    }

    public List<OrderItemRequestDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequestDto> items) {
        this.items = items != null ? items : new ArrayList<>();
    }
}
