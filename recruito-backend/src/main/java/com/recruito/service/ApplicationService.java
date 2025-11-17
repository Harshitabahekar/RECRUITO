package com.recruito.service;

import com.recruito.dto.ApplicationCreateRequest;
import com.recruito.dto.ApplicationDto;
import com.recruito.model.Application;
import com.recruito.model.Job;
import com.recruito.model.User;
import com.recruito.model.enums.ApplicationStatus;
import com.recruito.repository.ApplicationRepository;
import com.recruito.repository.JobRepository;
import com.recruito.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ApplicationDto createApplication(ApplicationCreateRequest request, String candidateId) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (job.getStatus() != com.recruito.model.enums.JobStatus.PUBLISHED) {
            throw new RuntimeException("Cannot apply to unpublished job");
        }
        
        if (applicationRepository.findByJobIdAndCandidateId(request.getJobId(), candidateId).isPresent()) {
            throw new RuntimeException("You have already applied for this job");
        }
        
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        Application application = new Application();
        application.setJobId(request.getJobId());
        application.setCandidateId(candidateId);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setCoverLetter(request.getCoverLetter());
        application.setResumeUrl(request.getResumeUrl());
        // createdAt and updatedAt are automatically handled by @CreatedDate and @LastModifiedDate
        
        application = applicationRepository.save(application);
        return mapToDto(application);
    }
    
    public Page<ApplicationDto> getApplicationsByCandidate(String candidateId, Pageable pageable) {
        return applicationRepository.findByCandidateId(candidateId, pageable).map(this::mapToDto);
    }
    
    public Page<ApplicationDto> getApplicationsByJob(String jobId, Pageable pageable) {
        return applicationRepository.findByJobId(jobId, pageable).map(this::mapToDto);
    }
    
    public Page<ApplicationDto> getApplicationsByRecruiter(String recruiterId, Pageable pageable) {
        // Get all jobs by recruiter, then get applications for those jobs
        List<String> jobIds = jobRepository.findByRecruiterId(recruiterId, Pageable.unpaged())
                .getContent()
                .stream()
                .map(Job::getId)
                .collect(Collectors.toList());
        
        return applicationRepository.findByJobIds(jobIds, pageable).map(this::mapToDto);
    }
    
    public ApplicationDto getApplicationById(String id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return mapToDto(application);
    }
    
    public ApplicationDto updateApplicationStatus(String id, ApplicationStatus status, String recruiterId) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized to update this application");
        }
        
        application.setStatus(status);
        // updatedAt is automatically handled by @LastModifiedDate
        application = applicationRepository.save(application);
        return mapToDto(application);
    }
    
    private ApplicationDto mapToDto(Application application) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(application.getId());
        dto.setJobId(application.getJobId());
        
        // Fetch job for title
        Job job = jobRepository.findById(application.getJobId()).orElse(null);
        if (job != null) {
            dto.setJobTitle(job.getTitle());
        }
        
        dto.setCandidateId(application.getCandidateId());
        
        // Fetch candidate for name and email
        User candidate = userRepository.findById(application.getCandidateId()).orElse(null);
        if (candidate != null) {
            dto.setCandidateName(candidate.getFirstName() + " " + candidate.getLastName());
            dto.setCandidateEmail(candidate.getEmail());
        }
        
        dto.setStatus(application.getStatus());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setResumeUrl(application.getResumeUrl());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        return dto;
    }
}
