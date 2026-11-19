package com.northwind.management.controller;

import com.northwind.management.dto.ApiResponse;
import com.northwind.management.dto.CustomerDto;
import com.northwind.management.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customer Management", description = "Register, view, update, and delete customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "Get all customers", description = "Retrieve list of customers with optional search query")
    public ResponseEntity<ApiResponse<List<CustomerDto>>> getAllCustomers(
            @RequestParam(value = "search", required = false) String search) {
        List<CustomerDto> list = customerService.getAllCustomers(search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID")
    public ResponseEntity<ApiResponse<CustomerDto>> getCustomerById(@PathVariable Integer id) {
        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @PostMapping
    @Operation(summary = "Register a new customer")
    public ResponseEntity<ApiResponse<CustomerDto>> createCustomer(@Valid @RequestBody CustomerDto dto) {
        CustomerDto created = customerService.createCustomer(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Customer registered successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing customer")
    public ResponseEntity<ApiResponse<CustomerDto>> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerDto dto) {
        CustomerDto updated = customerService.updateCustomer(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Customer updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Customer deleted successfully"));
    }
}
