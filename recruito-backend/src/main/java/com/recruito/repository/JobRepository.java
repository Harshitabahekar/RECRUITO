package com.recruito.repository;

import com.recruito.model.Job;
import com.recruito.model.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    Page<Job> findByRecruiterId(String recruiterId, Pageable pageable);
    
    @Query(value = "{}", fields = "{}")
    Page<Job> searchJobs(String title, String location, JobStatus status, Pageable pageable);
    
    // Alternative simpler query methods
    Page<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCaseAndStatus(
            String title, String location, JobStatus status, Pageable pageable);
}
