package com.northwind.management.repository;

import com.northwind.management.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.productName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.quantityPerUnit) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);

    List<Product> findByCategoryId(Integer categoryId);

    @Query("SELECT p FROM Product p WHERE p.unitsInStock <= p.reorderLevel")
    List<Product> findLowStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.unitsInStock <= p.reorderLevel")
    long countLowStockProducts();

    List<Product> findByDiscontinued(String discontinued);
}
