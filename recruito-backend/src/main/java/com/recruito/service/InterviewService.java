package com.recruito.service;

import com.recruito.dto.InterviewCreateRequest;
import com.recruito.dto.InterviewDto;
import com.recruito.dto.InterviewResponseRequest;
import com.recruito.model.Application;
import com.recruito.model.Interview;
import com.recruito.model.Job;
import com.recruito.model.User;
import com.recruito.model.enums.InterviewResponseStatus;
import com.recruito.repository.ApplicationRepository;
import com.recruito.repository.InterviewRepository;
import com.recruito.repository.JobRepository;
import com.recruito.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {
    
    @Autowired
    private InterviewRepository interviewRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public InterviewDto scheduleInterview(InterviewCreateRequest request, String recruiterId) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        // Check if user is admin or the job's recruiter
        User currentUser = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isAdmin = currentUser.getRole() == com.recruito.model.enums.Role.ADMIN;
        boolean isJobRecruiter = job.getRecruiterId().equals(recruiterId);
        
        if (!isAdmin && !isJobRecruiter) {
            throw new RuntimeException("Unauthorized to schedule interview for this application");
        }
        
        // Check if interview already exists
        List<Interview> existingInterviews = interviewRepository.findByCandidateId(application.getCandidateId())
                .stream()
                .filter(i -> i.getApplicationId().equals(application.getId()))
                .collect(Collectors.toList());
        
        if (!existingInterviews.isEmpty()) {
            throw new RuntimeException("Interview already scheduled for this application");
        }
        
        Interview interview = new Interview();
        interview.setApplicationId(request.getApplicationId());
        interview.setCandidateId(application.getCandidateId());
        interview.setRecruiterId(recruiterId);
        interview.setScheduledAt(request.getScheduledAt());
        interview.setLocation(request.getLocation());
        interview.setInterviewType(request.getInterviewType());
        interview.setNotes(request.getNotes());
        interview.setIsCompleted(false);
        interview.setCandidateResponseStatus(InterviewResponseStatus.PENDING);
        interview.setCandidateRespondedAt(null);
        interview.setCandidateResponseNote(null);
        // createdAt and updatedAt are automatically handled by @CreatedDate and @LastModifiedDate
        
        interview = interviewRepository.save(interview);
        return mapToDto(interview);
    }
    
    public List<InterviewDto> getInterviewsByCandidate(String candidateId) {
        return interviewRepository.findByCandidateId(candidateId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public List<InterviewDto> getInterviewsByRecruiter(String recruiterId) {
        return interviewRepository.findByRecruiterId(recruiterId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public InterviewDto getInterviewById(String id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        return mapToDto(interview);
    }
    
    public InterviewDto updateInterview(String id, InterviewCreateRequest request, String recruiterId) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        
        // Check if user is admin or the interview's recruiter
        User currentUser = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isAdmin = currentUser.getRole() == com.recruito.model.enums.Role.ADMIN;
        boolean isInterviewRecruiter = interview.getRecruiterId().equals(recruiterId);
        
        if (!isAdmin && !isInterviewRecruiter) {
            throw new RuntimeException("Unauthorized to update this interview");
        }
        
        interview.setScheduledAt(request.getScheduledAt());
        interview.setLocation(request.getLocation());
        interview.setInterviewType(request.getInterviewType());
        interview.setNotes(request.getNotes());
        interview.setCandidateResponseStatus(InterviewResponseStatus.PENDING);
        interview.setCandidateRespondedAt(null);
        interview.setCandidateResponseNote(null);
        // updatedAt is automatically handled by @LastModifiedDate
        
        interview = interviewRepository.save(interview);
        return mapToDto(interview);
    }
    
    public InterviewDto completeInterview(String id, String notes, String recruiterId) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        
        // Check if user is admin or the interview's recruiter
        User currentUser = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isAdmin = currentUser.getRole() == com.recruito.model.enums.Role.ADMIN;
        boolean isInterviewRecruiter = interview.getRecruiterId().equals(recruiterId);
        
        if (!isAdmin && !isInterviewRecruiter) {
            throw new RuntimeException("Unauthorized to complete this interview");
        }
        
        interview.setIsCompleted(true);
        interview.setCompletedAt(LocalDateTime.now());
        if (notes != null) {
            interview.setNotes(notes);
        }
        // updatedAt is automatically handled by @LastModifiedDate
        
        interview = interviewRepository.save(interview);
        return mapToDto(interview);
    }
    
    public List<InterviewDto> getInterviewsBetweenDates(LocalDateTime start, LocalDateTime end) {
        return interviewRepository.findInterviewsBetweenDates(start, end)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public InterviewDto respondToInterview(String id, String candidateId, InterviewResponseRequest request) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        if (!interview.getCandidateId().equals(candidateId)) {
            throw new RuntimeException("Unauthorized to respond to this interview");
        }

        interview.setCandidateResponseStatus(request.getResponse());
        interview.setCandidateResponseNote(request.getNote());
        interview.setCandidateRespondedAt(LocalDateTime.now());

        interview = interviewRepository.save(interview);
        return mapToDto(interview);
    }
    
    private InterviewDto mapToDto(Interview interview) {
        InterviewDto dto = new InterviewDto();
        dto.setId(interview.getId());
        dto.setApplicationId(interview.getApplicationId());
        dto.setCandidateId(interview.getCandidateId());
        
        User candidate = userRepository.findById(interview.getCandidateId()).orElse(null);
        if (candidate != null) {
            dto.setCandidateName(candidate.getFirstName() + " " + candidate.getLastName());
            dto.setCandidateEmail(candidate.getEmail());
        }
        
        dto.setRecruiterId(interview.getRecruiterId());
        
        User recruiter = userRepository.findById(interview.getRecruiterId()).orElse(null);
        if (recruiter != null) {
            dto.setRecruiterName(recruiter.getFirstName() + " " + recruiter.getLastName());
            dto.setRecruiterEmail(recruiter.getEmail());
        }
        
        dto.setScheduledAt(interview.getScheduledAt());
        dto.setCompletedAt(interview.getCompletedAt());
        dto.setNotes(interview.getNotes());
        dto.setLocation(interview.getLocation());
        dto.setInterviewType(interview.getInterviewType());
        dto.setIsCompleted(interview.getIsCompleted());
        dto.setCreatedAt(interview.getCreatedAt());
        dto.setCandidateResponseStatus(interview.getCandidateResponseStatus());
        dto.setCandidateRespondedAt(interview.getCandidateRespondedAt());
        dto.setCandidateResponseNote(interview.getCandidateResponseNote());
        return dto;
    }
}
