package com.recruito.service;

import com.recruito.dto.MessageDto;
import com.recruito.dto.MessageRequest;
import com.recruito.model.Message;
import com.recruito.model.User;
import com.recruito.repository.MessageRepository;
import com.recruito.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private String generateChatRoomId(String userId1, String userId2) {
        return userId1.compareTo(userId2) < 0 ? 
            userId1 + "_" + userId2 : 
            userId2 + "_" + userId1;
    }
    
    public MessageDto sendMessage(MessageRequest request, String senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        
        User receiver = userRepository.findByEmail(request.getReceiverEmail())
                .orElseThrow(() -> new RuntimeException("Receiver not found with email: " + request.getReceiverEmail()));
        
        String chatRoomId = generateChatRoomId(senderId, receiver.getId());
        
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiver.getId());
        message.setContent(request.getContent());
        message.setChatRoomId(chatRoomId);
        message.setIsRead(false);
        // createdAt is automatically handled by @CreatedDate
        
        message = messageRepository.save(message);
        return mapToDto(message);
    }
    
    public List<MessageDto> getChatMessages(String currentUserEmail, String otherUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        User otherUser = userRepository.findByEmail(otherUserEmail)
                .orElseThrow(() -> new RuntimeException("Other user not found with email: " + otherUserEmail));
        
        String chatRoomId = generateChatRoomId(currentUser.getId(), otherUser.getId());
        // Use findByChatRoomIdOrderByCreatedAtAsc which handles sorting
        // Filter out any messages with null createdAt for safety
        return messageRepository.findByChatRoomIdOrderByCreatedAtAsc(chatRoomId)
                .stream()
                .filter(msg -> msg.getCreatedAt() != null) // Filter null createdAt for safety
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public void markMessagesAsRead(String chatRoomId, String userId) {
        List<Message> unreadMessages = messageRepository.findUnreadMessages(chatRoomId, userId);
        unreadMessages.forEach(msg -> msg.setIsRead(true));
        messageRepository.saveAll(unreadMessages);
    }
    
    public long getUnreadMessageCount(String userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }
    
    private MessageDto mapToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setSenderId(message.getSenderId());
        
        User sender = userRepository.findById(message.getSenderId()).orElse(null);
        if (sender != null) {
            dto.setSenderName(sender.getFirstName() + " " + sender.getLastName());
            dto.setSenderEmail(sender.getEmail());
        }
        
        dto.setReceiverId(message.getReceiverId());
        
        User receiver = userRepository.findById(message.getReceiverId()).orElse(null);
        if (receiver != null) {
            dto.setReceiverName(receiver.getFirstName() + " " + receiver.getLastName());
            dto.setReceiverEmail(receiver.getEmail());
        }
        
        dto.setContent(message.getContent());
        dto.setIsRead(message.getIsRead());
        dto.setChatRoomId(message.getChatRoomId());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}
