package com.recruito.service;

import com.recruito.dto.JobCreateRequest;
import com.recruito.dto.JobDto;
import com.recruito.model.Job;
import com.recruito.model.User;
import com.recruito.model.enums.JobStatus;
import com.recruito.repository.ApplicationRepository;
import com.recruito.repository.JobRepository;
import com.recruito.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    public JobDto createJob(JobCreateRequest request, String recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setDepartment(request.getDepartment());
        job.setEmploymentType(request.getEmploymentType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setStatus(JobStatus.DRAFT);
        job.setRecruiterId(recruiterId);
        // createdAt and updatedAt are automatically handled by @CreatedDate and @LastModifiedDate
        
        job = jobRepository.save(job);
        return mapToDto(job);
    }
    
    public Page<JobDto> getAllJobs(Pageable pageable) {
        return jobRepository.findAll(pageable).map(this::mapToDto);
    }
    
    public Page<JobDto> getPublishedJobs(Pageable pageable) {
        return jobRepository.findByStatus(JobStatus.PUBLISHED, pageable).map(this::mapToDto);
    }
    
    public Page<JobDto> searchJobs(String title, String location, JobStatus status, Pageable pageable) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();
        
        if (title != null && !title.isEmpty()) {
            Pattern pattern = Pattern.compile(title, Pattern.CASE_INSENSITIVE);
            criteriaList.add(Criteria.where("title").regex(pattern));
        }
        
        if (location != null && !location.isEmpty()) {
            Pattern pattern = Pattern.compile(location, Pattern.CASE_INSENSITIVE);
            criteriaList.add(Criteria.where("location").regex(pattern));
        }
        
        if (status != null) {
            criteriaList.add(Criteria.where("status").is(status));
        }
        
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }
        
        // Apply pagination and sorting
        query.with(pageable);
        
        // Execute query
        List<Job> jobs = mongoTemplate.find(query, Job.class);
        long total = mongoTemplate.count(query, Job.class);
        
        return new PageImpl<>(jobs, pageable, total).map(this::mapToDto);
    }
    
    public Page<JobDto> getJobsByRecruiter(String recruiterId, Pageable pageable) {
        return jobRepository.findByRecruiterId(recruiterId, pageable).map(this::mapToDto);
    }
    
    public JobDto getJobById(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToDto(job);
    }
    
    public JobDto updateJob(String id, JobCreateRequest request, String recruiterId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to update this job");
        }
        
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setDepartment(request.getDepartment());
        job.setEmploymentType(request.getEmploymentType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        // updatedAt is automatically handled by @LastModifiedDate
        
        job = jobRepository.save(job);
        return mapToDto(job);
    }
    
    public void publishJob(String id, String recruiterId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to publish this job");
        }
        
        job.setStatus(JobStatus.PUBLISHED);
        job.setPublishedAt(LocalDateTime.now());
        // updatedAt is automatically handled by @LastModifiedDate
        jobRepository.save(job);
    }
    
    public void closeJob(String id, String recruiterId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to close this job");
        }
        
        job.setStatus(JobStatus.CLOSED);
        job.setClosedAt(LocalDateTime.now());
        // updatedAt is automatically handled by @LastModifiedDate
        jobRepository.save(job);
    }
    
    public void deleteJob(String id, String recruiterId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to delete this job");
        }
        
        jobRepository.delete(job);
    }
    
    private JobDto mapToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setDepartment(job.getDepartment());
        dto.setEmploymentType(job.getEmploymentType());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setStatus(job.getStatus());
        dto.setRecruiterId(job.getRecruiterId());
        
        // Fetch recruiter for name
        User recruiter = userRepository.findById(job.getRecruiterId()).orElse(null);
        if (recruiter != null) {
            dto.setRecruiterName(recruiter.getFirstName() + " " + recruiter.getLastName());
        }
        
        dto.setCreatedAt(job.getCreatedAt());
        dto.setPublishedAt(job.getPublishedAt());
        
        // Count applications
        long applicationCount = applicationRepository.findByJobId(job.getId(), Pageable.unpaged()).getTotalElements();
        dto.setApplicationCount(applicationCount);
        
        return dto;
    }
}
