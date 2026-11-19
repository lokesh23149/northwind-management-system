package com.northwind.management.repository;

import com.northwind.management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.lastname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Employee> searchEmployees(@Param("query") String query);

    Optional<Employee> findByEmail(String email);

    List<Employee> findByMgrId(Integer mgrId);
}
