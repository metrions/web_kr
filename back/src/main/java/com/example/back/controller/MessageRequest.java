package com.example.back.controller;

import lombok.Data;

import java.util.UUID;

@Data
public class MessageRequest {
    private String id;
    private String value;
    private String title;
}
