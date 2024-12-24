package com.example.back.controller;

import com.example.back.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatEndpoint {
    private final MongoRepository mongoRepository;

    @MessageMapping("/send/{id}")
    @SendTo("/topic/messages/{id}")
    public Message sendMessage(@DestinationVariable("id") String id, @RequestBody MessageRequest messageRequest) throws Throwable {
        // Логика сохранения сообщения
        Message text = (Message) mongoRepository
                .findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Could not find text with UUID: " + id));
        text.setTitle(messageRequest.getTitle());
        text.setValue(messageRequest.getValue());
        var mes = (Message) mongoRepository.save(text);
        System.out.println("Message saved and sent: " + mes.getValue());
        return mes;
    }

    @MessageMapping("/connect/{id}")
    @SendTo("/topic/messages/{id}")
    public Message sendCurrentText(@DestinationVariable String id) throws Throwable {
        return (Message) mongoRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Could not find text with UUID: " + id));
    }




}
