package com.northwind.management.controller;

import com.northwind.management.dto.ApiResponse;
import com.northwind.management.dto.EmployeeDto;
import com.northwind.management.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management", description = "Add, view, update, and delete employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @Operation(summary = "Get all employees", description = "Retrieve list of employees with optional search query")
    public ResponseEntity<ApiResponse<List<EmployeeDto>>> getAllEmployees(
            @RequestParam(value = "search", required = false) String search) {
        List<EmployeeDto> list = employeeService.getAllEmployees(search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<ApiResponse<EmployeeDto>> getEmployeeById(@PathVariable Integer id) {
        EmployeeDto employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success(employee));
    }

    @PostMapping
    @Operation(summary = "Add a new employee")
    public ResponseEntity<ApiResponse<EmployeeDto>> createEmployee(@Valid @RequestBody EmployeeDto dto) {
        EmployeeDto created = employeeService.createEmployee(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Employee created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing employee")
    public ResponseEntity<ApiResponse<EmployeeDto>> updateEmployee(
            @PathVariable Integer id,
            @Valid @RequestBody EmployeeDto dto) {
        EmployeeDto updated = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Employee updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an employee")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Employee deleted successfully"));
    }
}
