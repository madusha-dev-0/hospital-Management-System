package com.smartcare.Services;

import com.smartcare.Entity.DepartmentEntity;
import com.smartcare.Entity.DoctorEntity;
import com.smartcare.Repository.DepartmentRepository;
import com.smartcare.Repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<DoctorEntity> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<DoctorEntity> getDoctorById(int id) {
        return doctorRepository.findById(id);
    }

    public DoctorEntity addDoctor(DoctorEntity doctor) {
        validateDoctor(doctor);

        if (doctor.getDepartment() != null && doctor.getDepartment().getDepartment_ID() != null && doctor.getDepartment().getDepartment_ID() > 0) {
            int deptId = doctor.getDepartment().getDepartment_ID();
            DepartmentEntity dept = departmentRepository.findById(deptId)
                    .orElseThrow(() -> new RuntimeException("Department not found with ID: " + deptId));
            doctor.setDepartment(dept);
        }

        return doctorRepository.save(doctor);
    }

    public DoctorEntity updateDoctor(int id, DoctorEntity updatedDoctor) {
        return doctorRepository.findById(id).map(existing -> {
            if (updatedDoctor.getDoctor_Name() != null && !updatedDoctor.getDoctor_Name().trim().isEmpty()) {
                existing.setDoctor_Name(updatedDoctor.getDoctor_Name());
            }
            if (updatedDoctor.getSpecialization() != null && !updatedDoctor.getSpecialization().trim().isEmpty()) {
                existing.setSpecialization(updatedDoctor.getSpecialization());
            }
            if (updatedDoctor.getQualification() != null) {
                existing.setQualification(updatedDoctor.getQualification());
            }
            if (updatedDoctor.getContact_Number() != null && !updatedDoctor.getContact_Number().trim().isEmpty()) {
                existing.setContact_Number(updatedDoctor.getContact_Number());
            }
            if (updatedDoctor.getConsultation_Fee() != null) {
                if (updatedDoctor.getConsultation_Fee().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Consultation fee must be greater than zero");
                }
                existing.setConsultation_Fee(updatedDoctor.getConsultation_Fee());
            }
            if (updatedDoctor.getDepartment() != null && updatedDoctor.getDepartment().getDepartment_ID() != null && updatedDoctor.getDepartment().getDepartment_ID() > 0) {
                int deptId = updatedDoctor.getDepartment().getDepartment_ID();
                DepartmentEntity dept = departmentRepository.findById(deptId)
                        .orElseThrow(() -> new RuntimeException("Department not found with ID: " + deptId));
                existing.setDepartment(dept);
            }
            return doctorRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    public void deleteDoctor(int id) {
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found with ID: " + id);
        }
        doctorRepository.deleteById(id);
    }

    public List<DoctorEntity> searchDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    public List<DoctorEntity> getDoctorsByDepartment(int departmentId) {
        return doctorRepository.findByDepartmentId(departmentId);
    }

    public DoctorEntity assignDoctorToDepartment(int doctorId, int departmentId) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
        DepartmentEntity department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + departmentId));

        doctor.setDepartment(department);
        return doctorRepository.save(doctor);
    }

    private void validateDoctor(DoctorEntity doctor) {
        if (doctor.getDoctor_Name() == null || doctor.getDoctor_Name().trim().isEmpty()) {
            throw new IllegalArgumentException("Doctor name cannot be empty");
        }
        if (doctor.getSpecialization() == null || doctor.getSpecialization().trim().isEmpty()) {
            throw new IllegalArgumentException("Specialization cannot be empty");
        }
        if (doctor.getContact_Number() == null || doctor.getContact_Number().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact number cannot be empty");
        }
        if (doctor.getConsultation_Fee() == null || doctor.getConsultation_Fee().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Consultation fee must be greater than zero");
        }
    }
}
