package com.northwind.management.controller;

import com.northwind.management.dto.ApiResponse;
import com.northwind.management.dto.DeliveryUpdateDto;
import com.northwind.management.dto.OrderResponseDto;
import com.northwind.management.entity.DeliveryStatus;
import com.northwind.management.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@Tag(name = "Delivery Management", description = "Manage shipping information and update delivery status (Pending, Shipped, Delivered)")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    @Operation(summary = "Get all deliveries", description = "List all shipments with optional filtering by delivery status (PENDING, SHIPPED, DELIVERED) and search term")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getAllDeliveries(
            @RequestParam(value = "status", required = false) DeliveryStatus status,
            @RequestParam(value = "search", required = false) String search) {
        List<OrderResponseDto> list = deliveryService.getAllDeliveries(status, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get delivery details by order ID")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getDeliveryById(@PathVariable Integer orderId) {
        OrderResponseDto delivery = deliveryService.getDeliveryById(orderId);
        return ResponseEntity.ok(ApiResponse.success(delivery));
    }

    @PatchMapping ("/{orderId}/status")
    @Operation(summary = "Update delivery status", description = "Update delivery status to PENDING, SHIPPED, or DELIVERED, and optionally set shipped date and shipping destination")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateDeliveryStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody DeliveryUpdateDto dto) {
        OrderResponseDto updated = deliveryService.updateDeliveryStatus(orderId, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Delivery status updated to " + dto.getDeliveryStatus()));
    }
}
