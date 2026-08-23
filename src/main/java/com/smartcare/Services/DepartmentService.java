package com.smartcare.Services;

import com.smartcare.Entity.DepartmentEntity;
import com.smartcare.Repository.DepartmentRepository;
import com.smartcare.Repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<DepartmentEntity> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<DepartmentEntity> getDepartmentById(int id) {
        return departmentRepository.findById(id);
    }

    public DepartmentEntity addDepartment(DepartmentEntity department) {
        if (department.getDepartment_Name() == null || department.getDepartment_Name().trim().isEmpty()) {
            throw new IllegalArgumentException("Department name cannot be empty");
        }
        if (department.getLocation() == null || department.getLocation().trim().isEmpty()) {
            throw new IllegalArgumentException("Department location cannot be empty");
        }
        if (departmentRepository.existsByDepartmentName(department.getDepartment_Name())) {
            throw new IllegalArgumentException("Department name already exists: " + department.getDepartment_Name());
        }
        return departmentRepository.save(department);
    }

    public DepartmentEntity updateDepartment(int id, DepartmentEntity updatedDepartment) {
        return departmentRepository.findById(id).map(existing -> {
            if (updatedDepartment.getDepartment_Name() != null && !updatedDepartment.getDepartment_Name().trim().isEmpty()) {
                existing.setDepartment_Name(updatedDepartment.getDepartment_Name());
            }
            if (updatedDepartment.getLocation() != null && !updatedDepartment.getLocation().trim().isEmpty()) {
                existing.setLocation(updatedDepartment.getLocation());
            }
            return departmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
    }

    public void deleteDepartment(int id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found with ID: " + id);
        }
        if (!doctorRepository.findByDepartmentId(id).isEmpty()) {
            throw new IllegalArgumentException("Cannot delete department: Doctors are currently assigned to this department. Please reassign or delete the assigned doctors first.");
        }
        departmentRepository.deleteById(id);
    }

    public List<DepartmentEntity> searchDepartmentByName(String name) {
        return departmentRepository.findByDepartmentNameContainingIgnoreCase(name);
    }
}
