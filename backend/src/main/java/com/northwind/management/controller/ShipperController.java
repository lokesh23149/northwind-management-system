package com.northwind.management.controller;

import com.northwind.management.dto.ApiResponse;
import com.northwind.management.entity.Shipper;
import com.northwind.management.repository.ShipperRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shippers")
@Tag(name = "Shipper Reference", description = "Get shipping providers")
public class ShipperController {

    private final ShipperRepository shipperRepository;

    public ShipperController(ShipperRepository shipperRepository) {
        this.shipperRepository = shipperRepository;
    }

    @GetMapping
    @Operation(summary = "Get all shipping providers")
    public ResponseEntity<ApiResponse<List<Shipper>>> getAllShippers() {
        return ResponseEntity.ok(ApiResponse.success(shipperRepository.findAll()));
    }
}
