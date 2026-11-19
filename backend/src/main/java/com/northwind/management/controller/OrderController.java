package com.northwind.management.controller;

import com.northwind.management.dto.ApiResponse;
import com.northwind.management.dto.OrderRequestDto;
import com.northwind.management.dto.OrderResponseDto;
import com.northwind.management.entity.DeliveryStatus;
import com.northwind.management.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Purchase & Orders", description = "Allow customers to purchase multiple products, calculate totals and manage orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place a new customer purchase order", description = "Creates order with multiple line items, verifies & decrements stock atomically, calculates totals, and creates initial pending delivery")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(@Valid @RequestBody OrderRequestDto request) {
        OrderResponseDto created = orderService.createOrder(request);
        return new ResponseEntity<>(ApiResponse.success(created, "Order placed successfully! Stock updated."), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all orders", description = "Retrieve orders with optional filter by delivery status and search keyword")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getAllOrders(
            @RequestParam(value = "status", required = false) DeliveryStatus status,
            @RequestParam(value = "search", required = false) String search) {
        List<OrderResponseDto> list = orderService.getAllOrders(status, search);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID", description = "Retrieve full order details including line items, customer, shipper, and delivery status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderById(@PathVariable Integer id) {
        OrderResponseDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order", description = "Cancels an unshipped order and returns quantities back to inventory stock")
    public ResponseEntity<ApiResponse<OrderResponseDto>> cancelOrder(@PathVariable Integer id) {
        OrderResponseDto cancelled = orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Order cancelled successfully and product inventory restored."));
    }
}
