package com.recruito.model;

import com.recruito.model.enums.InterviewResponseStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Interview {
    @Id
    private String id;
    
    private String applicationId; // Reference to Application
    
    private String candidateId; // Reference to User
    
    private String recruiterId; // Reference to User
    
    private LocalDateTime scheduledAt;
    
    private LocalDateTime completedAt;
    
    private String notes;
    
    private String location; // Physical or video link
    private String interviewType; // PHONE, VIDEO, IN_PERSON
    
    private Boolean isCompleted = false;

    private InterviewResponseStatus candidateResponseStatus = InterviewResponseStatus.PENDING;

    private LocalDateTime candidateRespondedAt;

    private String candidateResponseNote;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
