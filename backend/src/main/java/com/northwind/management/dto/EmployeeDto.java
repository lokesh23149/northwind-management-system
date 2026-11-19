package com.northwind.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class EmployeeDto {

    private Integer employeeId;

    @NotBlank(message = "Last name is required")
    @Size(max = 20, message = "Last name cannot exceed 20 characters")
    private String lastname;

    @NotBlank(message = "First name is required")
    @Size(max = 10, message = "First name cannot exceed 10 characters")
    private String firstname;

    @Size(max = 30, message = "Title cannot exceed 30 characters")
    private String title;

    @Size(max = 25, message = "Title of courtesy cannot exceed 25 characters")
    private String titleOfCourtesy;

    private LocalDateTime birthDate;
    private LocalDateTime hireDate;

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

    @Size(max = 4, message = "Extension cannot exceed 4 characters")
    private String extension;

    @Size(max = 24, message = "Mobile cannot exceed 24 characters")
    private String mobile;

    @Email(message = "Email must be valid")
    @Size(max = 225, message = "Email cannot exceed 225 characters")
    private String email;

    private String photoPath;
    private String notes;
    private Integer mgrId;
    private String managerName;

    public EmployeeDto() {
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleOfCourtesy() {
        return titleOfCourtesy;
    }

    public void setTitleOfCourtesy(String titleOfCourtesy) {
        this.titleOfCourtesy = titleOfCourtesy;
    }

    public LocalDateTime getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDateTime birthDate) {
        this.birthDate = birthDate;
    }

    public LocalDateTime getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDateTime hireDate) {
        this.hireDate = hireDate;
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

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
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

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Integer getMgrId() {
        return mgrId;
    }

    public void setMgrId(Integer mgrId) {
        this.mgrId = mgrId;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }
}
