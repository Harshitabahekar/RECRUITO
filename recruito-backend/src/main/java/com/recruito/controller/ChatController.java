package com.recruito.controller;

import com.recruito.dto.MessageDto;
import com.recruito.dto.MessageRequest;
import com.recruito.service.MessageService;
import com.recruito.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @PostMapping("/send")
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody MessageRequest request,
                                                  Authentication authentication) {
        // Additional validation
        if (request.getReceiverEmail() == null || request.getReceiverEmail().trim().isEmpty()) {
            throw new RuntimeException("Receiver email is required and cannot be empty");
        }
        
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("Message content is required and cannot be empty");
        }
        
        String senderId = userService.getCurrentUserId(authentication);
        MessageDto message = messageService.sendMessage(request, senderId);
        
        // Send to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/chat/" + message.getChatRoomId(), message);
        messagingTemplate.convertAndSend("/queue/messages/" + message.getReceiverId(), message);
        
        return ResponseEntity.ok(message);
    }
    
    @GetMapping("/messages")
    public ResponseEntity<List<MessageDto>> getChatMessages(
            @RequestParam String otherUserEmail,
            Authentication authentication) {
        String currentUserEmail = userService.getCurrentUser(authentication).getEmail();
        List<MessageDto> messages = messageService.getChatMessages(currentUserEmail, otherUserEmail);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(@RequestParam String chatRoomId,
                                                   Authentication authentication) {
        String userId = userService.getCurrentUserId(authentication);
        messageService.markMessagesAsRead(chatRoomId, userId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount(Authentication authentication) {
        String userId = userService.getCurrentUserId(authentication);
        long count = messageService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public MessageDto sendPublicMessage(@Payload MessageDto message) {
        return message;
    }
}

