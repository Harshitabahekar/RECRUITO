package com.recruito.controller;

import com.recruito.dto.JobCreateRequest;
import com.recruito.dto.JobDto;
import com.recruito.model.enums.JobStatus;
import com.recruito.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {
    
    @Autowired
    private JobService jobService;
    
    @Autowired
    private com.recruito.service.UserService userService;
    
    @PostMapping
    public ResponseEntity<JobDto> createJob(@Valid @RequestBody JobCreateRequest request,
                                           Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        JobDto job = jobService.createJob(request, recruiterId);
        return ResponseEntity.ok(job);
    }
    
    @GetMapping
    public ResponseEntity<Page<JobDto>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status) {
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<JobDto> jobs;
        
        // Convert status string to enum if provided
        JobStatus statusEnum = null;
        if (status != null && !status.isEmpty()) {
            try {
                statusEnum = JobStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        // If status is PUBLISHED and no search terms, get published jobs
        // Otherwise, use search
        if ((title == null || title.isEmpty()) && 
            (location == null || location.isEmpty()) && 
            (statusEnum == JobStatus.PUBLISHED || statusEnum == null)) {
            jobs = jobService.getPublishedJobs(pageable);
        } else {
            jobs = jobService.searchJobs(
                (title != null && !title.isEmpty()) ? title : null,
                (location != null && !location.isEmpty()) ? location : null,
                statusEnum,
                pageable);
        }
        
        return ResponseEntity.ok(jobs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable String id) {
        JobDto job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(@PathVariable String id,
                                           @Valid @RequestBody JobCreateRequest request,
                                           Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        JobDto job = jobService.updateJob(id, request, recruiterId);
        return ResponseEntity.ok(job);
    }
    
    @PostMapping("/{id}/publish")
    public ResponseEntity<Void> publishJob(@PathVariable String id, Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        jobService.publishJob(id, recruiterId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/close")
    public ResponseEntity<Void> closeJob(@PathVariable String id, Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        jobService.closeJob(id, recruiterId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable String id, Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        jobService.deleteJob(id, recruiterId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/recruiter/my-jobs")
    public ResponseEntity<Page<JobDto>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<JobDto> jobs = jobService.getJobsByRecruiter(recruiterId, pageable);
        return ResponseEntity.ok(jobs);
    }
}

