package com.library.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableScheduling
public class RateLimitConfig {

    private final Map<String, Integer> attempts = new ConcurrentHashMap<>();

    public boolean isAllowed(String email) {
        attempts.merge(email, 1, Integer::sum);
        return attempts.get(email) <= 5; // max 5 OTP requests
    }

    // Reset every 10 minutes
    @Scheduled(fixedRate = 600000)
    public void resetAttempts() {
        attempts.clear();
    }
}
