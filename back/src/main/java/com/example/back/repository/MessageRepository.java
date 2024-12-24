package com.example.back.repository;

import com.example.back.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessageRepository extends MongoRepository<Message, UUID> {
    Optional<Message> findById(UUID id);
    void deleteById(UUID id);
}
