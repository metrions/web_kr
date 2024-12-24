package com.example.back.configuration.WebSocketsConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${frontend}")
    private String frontendUrl;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(frontendUrl, "http://192.168.0.105:3000", "http://localhost:3000", "https://yourfrontenddomain.com")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                        .allowCredentials(true)  // если у вас есть необходимость в передаче куки или токенов
                        .maxAge(3600); // Указывает, сколько времени CORS будет кешировать ответ
            }
        };
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins(frontendUrl, "http://192.168.0.105:3000", "http://localhost:3000", "https://yourfrontenddomain.com")
                .withSockJS(); // Подключение WebSocket с поддержкой SockJS
    }
}
