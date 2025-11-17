package com.recruito.service;

import com.recruito.dto.AnalyticsDto;
import com.recruito.model.enums.ApplicationStatus;
import com.recruito.model.enums.JobStatus;
import com.recruito.model.enums.Role;
import com.recruito.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private ApplicationRepository applicationRepository;
    
    @Autowired
    private InterviewRepository interviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    public AnalyticsDto getDashboardAnalytics(String recruiterId) {
        AnalyticsDto analytics = new AnalyticsDto();
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
        
        // Total counts
        analytics.setTotalJobs(recruiterId != null ? 
            jobRepository.findByRecruiterId(recruiterId, pageable).getTotalElements() : 
            jobRepository.count());
        
        // For recruiter, get applications through their jobs
        if (recruiterId != null) {
            List<String> jobIds = jobRepository.findByRecruiterId(recruiterId, pageable)
                    .getContent()
                    .stream()
                    .map(com.recruito.model.Job::getId)
                    .collect(Collectors.toList());
            analytics.setTotalApplications(applicationRepository.findByJobIds(jobIds, pageable).getTotalElements());
        } else {
            analytics.setTotalApplications(applicationRepository.count());
        }
        
        analytics.setTotalInterviews(recruiterId != null ?
                interviewRepository.findByRecruiterId(recruiterId).size() :
                    interviewRepository.count());
        
        analytics.setTotalUsers(userRepository.count());
        analytics.setActiveRecruiters(userRepository.countByRole(Role.RECRUITER));
        analytics.setActiveCandidates(userRepository.countByRole(Role.CANDIDATE));
        
        // Applications by status
        Map<String, Long> applicationsByStatus = new HashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            long count;
            if (recruiterId != null) {
                List<String> jobIds = jobRepository.findByRecruiterId(recruiterId, pageable)
                        .getContent()
                        .stream()
                        .map(com.recruito.model.Job::getId)
                        .collect(Collectors.toList());
                count = applicationRepository.findByJobIds(jobIds, pageable)
                        .stream()
                        .filter(app -> app.getStatus() == status)
                        .count();
            } else {
                count = applicationRepository.findByStatus(status).size();
            }
            applicationsByStatus.put(status.name(), count);
        }
        analytics.setApplicationsByStatus(applicationsByStatus);
        
        // Jobs by status
        Map<String, Long> jobsByStatus = new HashMap<>();
        for (JobStatus status : JobStatus.values()) {
            long count = recruiterId != null ?
                jobRepository.findByRecruiterId(recruiterId, pageable)
                    .stream()
                    .filter(job -> job.getStatus() == status)
                    .count() :
                jobRepository.findByStatus(status, pageable).getTotalElements();
            jobsByStatus.put(status.name(), count);
        }
        analytics.setJobsByStatus(jobsByStatus);
        
        // Interviews by month (last 6 months)
        Map<String, Long> interviewsByMonth = new HashMap<>();
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<com.recruito.model.Interview> recentInterviews = interviewRepository
            .findInterviewsBetweenDates(sixMonthsAgo, LocalDateTime.now());
        
        if (recruiterId != null) {
            recentInterviews = recentInterviews.stream()
                .filter(i -> i.getRecruiterId().equals(recruiterId))
                .collect(Collectors.toList());
        }
        
        recentInterviews.forEach(interview -> {
            String monthKey = interview.getScheduledAt().getYear() + "-" + 
                             String.format("%02d", interview.getScheduledAt().getMonthValue());
            interviewsByMonth.merge(monthKey, 1L, Long::sum);
        });
        analytics.setInterviewsByMonth(interviewsByMonth);
        
        // Conversion rate (Hired / Total Applications)
        long totalApplications = analytics.getTotalApplications();
        long hiredCount = applicationsByStatus.getOrDefault(ApplicationStatus.HIRED.name(), 0L);
        analytics.setConversionRate(totalApplications > 0 ? 
            (double) hiredCount / totalApplications * 100 : 0.0);
        
        return analytics;
    }
}

