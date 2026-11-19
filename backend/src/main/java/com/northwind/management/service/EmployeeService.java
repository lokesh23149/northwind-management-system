package com.northwind.management.service;

import com.northwind.management.dto.EmployeeDto;
import com.northwind.management.entity.Employee;
import com.northwind.management.exception.ResourceNotFoundException;
import com.northwind.management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees(String search) {
        List<Employee> list;
        if (search != null && !search.trim().isEmpty()) {
            list = employeeRepository.searchEmployees(search.trim());
        } else {
            list = employeeRepository.findAll();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return toDto(employee);
    }

    public EmployeeDto createEmployee(EmployeeDto dto) {
        Employee employee = new Employee();
        mapDtoToEntity(dto, employee);
        Employee saved = employeeRepository.save(employee);
        return toDto(saved);
    }

    public EmployeeDto updateEmployee(Integer id, EmployeeDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        mapDtoToEntity(dto, employee);
        Employee updated = employeeRepository.save(employee);
        return toDto(updated);
    }

    public void deleteEmployee(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);
    }

    public EmployeeDto toDto(Employee entity) {
        if (entity == null) return null;
        EmployeeDto dto = new EmployeeDto();
        dto.setEmployeeId(entity.getEmployeeId());
        dto.setLastname(entity.getLastname());
        dto.setFirstname(entity.getFirstname());
        dto.setTitle(entity.getTitle());
        dto.setTitleOfCourtesy(entity.getTitleOfCourtesy());
        dto.setBirthDate(entity.getBirthDate());
        dto.setHireDate(entity.getHireDate());
        dto.setAddress(entity.getAddress());
        dto.setCity(entity.getCity());
        dto.setRegion(entity.getRegion());
        dto.setPostalCode(entity.getPostalCode());
        dto.setCountry(entity.getCountry());
        dto.setPhone(entity.getPhone());
        dto.setExtension(entity.getExtension());
        dto.setMobile(entity.getMobile());
        dto.setEmail(entity.getEmail());
        dto.setPhotoPath(entity.getPhotoPath());
        dto.setNotes(entity.getNotes());
        dto.setMgrId(entity.getMgrId());
        if (entity.getManager() != null) {
            dto.setManagerName(entity.getManager().getFullName());
        }
        return dto;
    }

    private void mapDtoToEntity(EmployeeDto dto, Employee entity) {
        entity.setLastname(dto.getLastname());
        entity.setFirstname(dto.getFirstname());
        entity.setTitle(dto.getTitle());
        entity.setTitleOfCourtesy(dto.getTitleOfCourtesy());
        entity.setBirthDate(dto.getBirthDate());
        entity.setHireDate(dto.getHireDate());
        entity.setAddress(dto.getAddress());
        entity.setCity(dto.getCity());
        entity.setRegion(dto.getRegion());
        entity.setPostalCode(dto.getPostalCode());
        entity.setCountry(dto.getCountry());
        entity.setPhone(dto.getPhone());
        entity.setExtension(dto.getExtension());
        entity.setMobile(dto.getMobile());
        entity.setEmail(dto.getEmail());
        entity.setPhotoPath(dto.getPhotoPath());
        entity.setNotes(dto.getNotes());
        entity.setMgrId(dto.getMgrId());
    }
}
