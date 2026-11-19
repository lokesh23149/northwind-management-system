package com.northwind.management.service;

import com.northwind.management.dto.CustomerDto;
import com.northwind.management.entity.Customer;
import com.northwind.management.exception.ResourceNotFoundException;
import com.northwind.management.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> getAllCustomers(String search) {
        List<Customer> list;
        if (search != null && !search.trim().isEmpty()) {
            list = customerRepository.searchCustomers(search.trim());
        } else {
            list = customerRepository.findAll();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CustomerDto getCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        return toDto(customer);
    }

    public CustomerDto createCustomer(CustomerDto dto) {
        Customer customer = new Customer();
        mapDtoToEntity(dto, customer);
        Customer saved = customerRepository.save(customer);
        return toDto(saved);
    }

    public CustomerDto updateCustomer(Integer id, CustomerDto dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        mapDtoToEntity(dto, customer);
        Customer updated = customerRepository.save(customer);
        return toDto(updated);
    }

    public void deleteCustomer(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", id));
        customerRepository.delete(customer);
    }

    public CustomerDto toDto(Customer entity) {
        if (entity == null) return null;
        CustomerDto dto = new CustomerDto();
        dto.setCustId(entity.getCustId());
        dto.setCompanyName(entity.getCompanyName());
        dto.setContactName(entity.getContactName());
        dto.setContactTitle(entity.getContactTitle());
        dto.setAddress(entity.getAddress());
        dto.setCity(entity.getCity());
        dto.setRegion(entity.getRegion());
        dto.setPostalCode(entity.getPostalCode());
        dto.setCountry(entity.getCountry());
        dto.setPhone(entity.getPhone());
        dto.setMobile(entity.getMobile());
        dto.setEmail(entity.getEmail());
        dto.setFax(entity.getFax());
        return dto;
    }

    private void mapDtoToEntity(CustomerDto dto, Customer entity) {
        entity.setCompanyName(dto.getCompanyName());
        entity.setContactName(dto.getContactName());
        entity.setContactTitle(dto.getContactTitle());
        entity.setAddress(dto.getAddress());
        entity.setCity(dto.getCity());
        entity.setRegion(dto.getRegion());
        entity.setPostalCode(dto.getPostalCode());
        entity.setCountry(dto.getCountry());
        entity.setPhone(dto.getPhone());
        entity.setMobile(dto.getMobile());
        entity.setEmail(dto.getEmail());
        entity.setFax(dto.getFax());
    }
}
