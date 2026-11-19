package com.northwind.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CustomerDto {

    private Integer custId;

    @NotBlank(message = "Company name is required")
    @Size(max = 40, message = "Company name cannot exceed 40 characters")
    private String companyName;

    @Size(max = 30, message = "Contact name cannot exceed 30 characters")
    private String contactName;

    @Size(max = 30, message = "Contact title cannot exceed 30 characters")
    private String contactTitle;

    @Size(max = 60, message = "Address cannot exceed 60 characters")
    private String address;

    @Size(max = 15, message = "City cannot exceed 15 characters")
    private String city;

    @Size(max = 15, message = "Region cannot exceed 15 characters")
    private String region;

    @Size(max = 10, message = "Postal code cannot exceed 10 characters")
    private String postalCode;

    @Size(max = 15, message = "Country cannot exceed 15 characters")
    private String country;

    @Size(max = 24, message = "Phone cannot exceed 24 characters")
    private String phone;

    @Size(max = 24, message = "Mobile cannot exceed 24 characters")
    private String mobile;

    @Email(message = "Email must be valid")
    @Size(max = 225, message = "Email cannot exceed 225 characters")
    private String email;

    @Size(max = 24, message = "Fax cannot exceed 24 characters")
    private String fax;

    public CustomerDto() {
    }

    public Integer getCustId() {
        return custId;
    }

    public void setCustId(Integer custId) {
        this.custId = custId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactTitle() {
        return contactTitle;
    }

    public void setContactTitle(String contactTitle) {
        this.contactTitle = contactTitle;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }
}
