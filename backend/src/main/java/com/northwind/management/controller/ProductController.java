package com.northwind.management.controller;

import com.northwind.management.dto.ApiResponse;
import com.northwind.management.dto.ProductDto;
import com.northwind.management.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Management", description = "Manage products, prices, and stock")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve products with optional filtering by search term, category, or low-stock status")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "lowStock", required = false) Boolean lowStock) {
        List<ProductDto> list = productService.getAllProducts(search, categoryId, lowStock);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Integer id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PostMapping
    @Operation(summary = "Add a new product")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductDto dto) {
        ProductDto created = productService.createProduct(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Product created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductDto dto) {
        ProductDto updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Product updated successfully"));
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Update product stock quantity")
    public ResponseEntity<ApiResponse<ProductDto>> updateStock(
            @PathVariable Integer id,
            @RequestBody Map<String, Short> stockPayload) {
        Short newStock = stockPayload.get("unitsInStock");
        if (newStock == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing 'unitsInStock' in payload"));
        }
        ProductDto updated = productService.updateStock(id, newStock);
        return ResponseEntity.ok(ApiResponse.success(updated, "Product stock updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }
}
