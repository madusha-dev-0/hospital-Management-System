package com.smartcare.Repository;

<<<<<<< HEAD
import com.smartcare.Entity.PatientEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, Integer> {


=======
import org.springframework.stereotype.Repository;

@Repository
public class PatientRepository {
>>>>>>> f754e7a7edf83b83edd09afea8dcebaaed467cb0
}
