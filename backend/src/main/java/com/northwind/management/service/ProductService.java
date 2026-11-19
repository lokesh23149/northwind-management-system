package com.northwind.management.service;

import com.northwind.management.dto.ProductDto;
import com.northwind.management.entity.Category;
import com.northwind.management.entity.Product;
import com.northwind.management.entity.Supplier;
import com.northwind.management.exception.ResourceNotFoundException;
import com.northwind.management.repository.CategoryRepository;
import com.northwind.management.repository.ProductRepository;
import com.northwind.management.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts(String search, Integer categoryId, Boolean lowStockOnly) {
        List<Product> list;

        if (Boolean.TRUE.equals(lowStockOnly)) {
            list = productRepository.findLowStockProducts();
        } else if (categoryId != null && categoryId > 0) {
            list = productRepository.findByCategoryId(categoryId);
        } else if (search != null && !search.trim().isEmpty()) {
            list = productRepository.searchProducts(search.trim());
        } else {
            list = productRepository.findAll();
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return toDto(product);
    }

    public ProductDto createProduct(ProductDto dto) {
        Product product = new Product();
        mapDtoToEntity(dto, product);
        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    public ProductDto updateProduct(Integer id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        mapDtoToEntity(dto, product);
        Product updated = productRepository.save(product);
        return toDto(updated);
    }

    public ProductDto updateStock(Integer id, Short newStock) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock units cannot be negative");
        }
        product.setUnitsInStock(newStock);
        Product updated = productRepository.save(product);
        return toDto(updated);
    }

    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    public ProductDto toDto(Product entity) {
        if (entity == null) return null;
        ProductDto dto = new ProductDto();
        dto.setProductId(entity.getProductId());
        dto.setProductName(entity.getProductName());
        dto.setSupplierId(entity.getSupplierId());
        dto.setCategoryId(entity.getCategoryId());
        dto.setQuantityPerUnit(entity.getQuantityPerUnit());
        dto.setUnitPrice(entity.getUnitPrice());
        dto.setUnitsInStock(entity.getUnitsInStock());
        dto.setUnitsOnOrder(entity.getUnitsOnOrder());
        dto.setReorderLevel(entity.getReorderLevel());
        dto.setDiscontinued(entity.getDiscontinued());
        dto.setLowStock(entity.isLowStock());

        if (entity.getCategory() != null) {
            dto.setCategoryName(entity.getCategory().getCategoryName());
        } else if (entity.getCategoryId() != null) {
            categoryRepository.findById(entity.getCategoryId())
                    .ifPresent(c -> dto.setCategoryName(c.getCategoryName()));
        }

        if (entity.getSupplier() != null) {
            dto.setSupplierName(entity.getSupplier().getCompanyName());
        } else if (entity.getSupplierId() != null) {
            supplierRepository.findById(entity.getSupplierId())
                    .ifPresent(s -> dto.setSupplierName(s.getCompanyName()));
        }

        return dto;
    }

    private void mapDtoToEntity(ProductDto dto, Product entity) {
        entity.setProductName(dto.getProductName());
        entity.setSupplierId(dto.getSupplierId());
        entity.setCategoryId(dto.getCategoryId());
        entity.setQuantityPerUnit(dto.getQuantityPerUnit());
        entity.setUnitPrice(dto.getUnitPrice());
        entity.setUnitsInStock(dto.getUnitsInStock());
        entity.setUnitsOnOrder(dto.getUnitsOnOrder());
        entity.setReorderLevel(dto.getReorderLevel());
        entity.setDiscontinued(dto.getDiscontinued() != null ? dto.getDiscontinued() : "0");
    }
}
