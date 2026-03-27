package com.library.controller;

import com.library.model.User;
import com.library.repository.UserRepository;
import com.library.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        if (!user.getIsActive()) {
            return ResponseEntity.status(403).body("Account is disabled");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return ResponseEntity.ok(new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole().name()
        ));
    }

    // DTO classes (Standard Java classes to avoid Lombok issues on Java 25)
    public static class LoginRequest {
        private String username;
        private String password;

        public LoginRequest() {}

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private Long id;
        private String username;
        private String fullName;
        private String role;

        public LoginResponse(String token, Long id, String username, String fullName, String role) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.fullName = fullName;
            this.role = role;
        }

        public String getToken() { return token; }
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getFullName() { return fullName; }
        public String getRole() { return role; }
    }
}
