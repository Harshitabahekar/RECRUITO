package com.recruito.model;

import com.recruito.model.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    @Id
    private String id;
    
    private String jobId; // Reference to Job
    
    private String candidateId; // Reference to User
    
    private ApplicationStatus status = ApplicationStatus.APPLIED;
    
    private String coverLetter;
    
    private String resumeUrl;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
