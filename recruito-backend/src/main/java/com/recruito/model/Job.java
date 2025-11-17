package com.recruito.model;

import com.recruito.model.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private String location;
    
    private String department;
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT
    
    private BigDecimal salaryMin;
    
    private BigDecimal salaryMax;
    
    private JobStatus status = JobStatus.DRAFT;
    
    private String recruiterId; // Reference to User
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private LocalDateTime publishedAt;
    private LocalDateTime closedAt;
}
