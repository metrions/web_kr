package com.example.back.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document("text")
@Getter
@Setter
public class Message {
    @Id
    private UUID id = UUID.randomUUID();

    private String title;

    private String value;
}
