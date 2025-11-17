package com.recruito.repository;

import com.recruito.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChatRoomIdOrderByCreatedAtAsc(String chatRoomId);
    
    @Query("{ 'chatRoomId': ?0, 'receiverId': ?1, 'isRead': false }")
    List<Message> findUnreadMessages(String chatRoomId, String userId);
    
    long countByReceiverIdAndIsReadFalse(String receiverId);
}
