package com.recruito.controller;

import com.recruito.dto.ApplicationCreateRequest;
import com.recruito.dto.ApplicationDto;
import com.recruito.model.enums.ApplicationStatus;
import com.recruito.service.ApplicationService;
import com.recruito.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {
    
    @Autowired
    private ApplicationService applicationService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<ApplicationDto> createApplication(@Valid @RequestBody ApplicationCreateRequest request,
                                                           Authentication authentication) {
        String candidateId = userService.getCurrentUserId(authentication);
        ApplicationDto application = applicationService.createApplication(request, candidateId);
        return ResponseEntity.ok(application);
    }
    
    @GetMapping("/my-applications")
    public ResponseEntity<Page<ApplicationDto>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String candidateId = userService.getCurrentUserId(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationDto> applications = applicationService.getApplicationsByCandidate(candidateId, pageable);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/job/{jobId}")
    public ResponseEntity<Page<ApplicationDto>> getApplicationsByJob(
            @PathVariable String jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationDto> applications = applicationService.getApplicationsByJob(jobId, pageable);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/recruiter/my-applications")
    public ResponseEntity<Page<ApplicationDto>> getRecruiterApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationDto> applications = applicationService.getApplicationsByRecruiter(recruiterId, pageable);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable String id) {
        ApplicationDto application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable String id,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        ApplicationDto application = applicationService.updateApplicationStatus(id, status, recruiterId);
        return ResponseEntity.ok(application);
    }
}

