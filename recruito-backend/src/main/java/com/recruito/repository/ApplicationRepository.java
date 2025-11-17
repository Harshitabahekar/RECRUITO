package com.recruito.repository;

import com.recruito.model.Application;
import com.recruito.model.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    Page<Application> findByCandidateId(String candidateId, Pageable pageable);
    Page<Application> findByJobId(String jobId, Pageable pageable);
    
    @Query("{ 'jobId': { $in: ?0 } }")
    Page<Application> findByJobIds(List<String> jobIds, Pageable pageable);
    
    List<Application> findByStatus(ApplicationStatus status);
    Optional<Application> findByJobIdAndCandidateId(String jobId, String candidateId);
}
