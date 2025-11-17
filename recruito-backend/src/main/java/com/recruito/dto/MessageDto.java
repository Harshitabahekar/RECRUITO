package com.recruito.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDto {
    private String id;
    private String senderId;
    private String senderName;
    private String senderEmail;
    private String receiverId;
    private String receiverName;
    private String receiverEmail;
    private String content;
    private Boolean isRead;
    private String chatRoomId;
    private LocalDateTime createdAt;
}

