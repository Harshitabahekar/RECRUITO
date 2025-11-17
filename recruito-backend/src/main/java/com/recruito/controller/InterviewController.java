package com.recruito.controller;

import com.recruito.dto.InterviewCreateRequest;
import com.recruito.dto.InterviewDto;
import com.recruito.dto.InterviewResponseRequest;
import com.recruito.service.InterviewService;
import com.recruito.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:3000")
public class InterviewController {
    
    @Autowired
    private InterviewService interviewService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<InterviewDto> scheduleInterview(@Valid @RequestBody InterviewCreateRequest request,
                                                          Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        InterviewDto interview = interviewService.scheduleInterview(request, recruiterId);
        return ResponseEntity.ok(interview);
    }
    
    @GetMapping("/my-interviews")
    public ResponseEntity<List<InterviewDto>> getMyInterviews(Authentication authentication) {
        String candidateId = userService.getCurrentUserId(authentication);
        List<InterviewDto> interviews = interviewService.getInterviewsByCandidate(candidateId);
        return ResponseEntity.ok(interviews);
    }
    
    @GetMapping("/recruiter/my-interviews")
    public ResponseEntity<List<InterviewDto>> getRecruiterInterviews(Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        List<InterviewDto> interviews = interviewService.getInterviewsByRecruiter(recruiterId);
        return ResponseEntity.ok(interviews);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InterviewDto> getInterviewById(@PathVariable String id) {
        InterviewDto interview = interviewService.getInterviewById(id);
        return ResponseEntity.ok(interview);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<InterviewDto> updateInterview(@PathVariable String id,
                                                        @Valid @RequestBody InterviewCreateRequest request,
                                                        Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        InterviewDto interview = interviewService.updateInterview(id, request, recruiterId);
        return ResponseEntity.ok(interview);
    }
    
    @PostMapping("/{id}/complete")
    public ResponseEntity<InterviewDto> completeInterview(@PathVariable String id,
                                                          @RequestParam(required = false) String notes,
                                                          Authentication authentication) {
        String recruiterId = userService.getCurrentUserId(authentication);
        InterviewDto interview = interviewService.completeInterview(id, notes, recruiterId);
        return ResponseEntity.ok(interview);
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<InterviewDto> respondToInterview(@PathVariable String id,
                                                           @Valid @RequestBody InterviewResponseRequest request,
                                                           Authentication authentication) {
        String candidateId = userService.getCurrentUserId(authentication);
        InterviewDto interview = interviewService.respondToInterview(id, candidateId, request);
        return ResponseEntity.ok(interview);
    }
    
    @GetMapping("/calendar")
    public ResponseEntity<List<InterviewDto>> getInterviewsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<InterviewDto> interviews = interviewService.getInterviewsBetweenDates(start, end);
        return ResponseEntity.ok(interviews);
    }
}

