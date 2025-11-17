package com.recruito.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    private String id;
    
    private String senderId; // Reference to User
    
    private String receiverId; // Reference to User
    
    private String content;
    
    private Boolean isRead = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    // For chat room identification
    private String chatRoomId;
}
