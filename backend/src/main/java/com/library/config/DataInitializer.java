package com.library.config;

import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername("admin").orElse(null);
            
            if (admin == null) {
                admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("System Admin");
                admin.setRole(User.Role.ADMIN);
                admin.setIsActive(true);
                userRepository.save(admin);
                System.out.println("Default admin account created: admin / admin123");
            } else {
                // Forcibly reset password in dev if user exists to ensure login works
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
                System.out.println("Admin password reset to: admin123");
            }
        };
    }
}
