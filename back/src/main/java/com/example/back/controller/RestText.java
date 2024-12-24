package com.example.back.controller;

import com.example.back.entity.Message;
import com.example.back.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class RestText {
    private final MessageRepository messageRepository;

    @PostMapping("/createText")
    public Message createText() {
        Message message = new Message();
        message = messageRepository.save(message);

        return message;
    }

    @GetMapping("/getTexts")
    public List<Message> getTexts() {
        List<Message> messages = (List<Message>) messageRepository.findAll();
        return messages;
    }

    @DeleteMapping("/delete")
    public void getTexts(@RequestParam UUID id) {
        messageRepository.deleteById(id);
    }

}
