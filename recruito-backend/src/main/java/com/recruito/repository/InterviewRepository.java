package com.recruito.repository;

import com.recruito.model.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterviewRepository extends MongoRepository<Interview, String> {
    List<Interview> findByCandidateId(String candidateId);
    List<Interview> findByRecruiterId(String recruiterId);
    
    @Query("{ 'scheduledAt': { $gte: ?0, $lte: ?1 } }")
    List<Interview> findInterviewsBetweenDates(LocalDateTime start, LocalDateTime end);
}
