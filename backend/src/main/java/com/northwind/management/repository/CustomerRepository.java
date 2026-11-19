package com.northwind.management.repository;

import com.northwind.management.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.contactName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.country) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Customer> searchCustomers(@Param("query") String query);

    List<Customer> findByCountryIgnoreCase(String country);
}
