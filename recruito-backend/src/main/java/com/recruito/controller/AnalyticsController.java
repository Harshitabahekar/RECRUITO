package com.recruito.controller;

import com.recruito.dto.AnalyticsDto;
import com.recruito.service.AnalyticsService;
import com.recruito.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsDto> getDashboardAnalytics(Authentication authentication) {
        String userId = null;
        try {
            userId = userService.getCurrentUserId(authentication);
            com.recruito.model.User user = userService.getCurrentUser(authentication);
            // Only pass recruiterId if user is a recruiter
            if (user.getRole() != com.recruito.model.enums.Role.RECRUITER && 
                user.getRole() != com.recruito.model.enums.Role.ADMIN) {
                userId = null;
            }
        } catch (Exception e) {
            // If not authenticated, show global analytics
        }
        
        AnalyticsDto analytics = analyticsService.getDashboardAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }
}

