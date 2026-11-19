package com.northwind.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Shipper")
public class Shipper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipperId")
    private Integer shipperId;

    @Column(name = "companyName", nullable = false, length = 40)
    private String companyName;

    @Column(name = "phone", length = 44)
    private String phone;

    public Shipper() {
    }

    public Shipper(Integer shipperId, String companyName, String phone) {
        this.shipperId = shipperId;
        this.companyName = companyName;
        this.phone = phone;
    }

    public Integer getShipperId() {
        return shipperId;
    }

    public void setShipperId(Integer shipperId) {
        this.shipperId = shipperId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
