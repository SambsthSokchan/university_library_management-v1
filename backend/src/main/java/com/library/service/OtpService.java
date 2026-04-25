package com.library.service;

import com.library.model.ForgotPasswordOtp;
import com.library.model.User;
import com.library.repository.OtpTokenRepository;
import com.library.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final OtpTokenRepository otpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public OtpService(OtpTokenRepository otpRepository, UserRepository userRepository, EmailService emailService) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // STEP 1: Check email → Send OTP
    public String sendOtp(String email) {
        // 🔴 NO branch — email not found
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email not found in database"));

        // ✅ YES branch — delete old OTP, create new
        otpRepository.findByUser(user).ifPresent(otpRepository::delete);

        String otp = String.format("%06d", new SecureRandom().nextInt(999999));

        ForgotPasswordOtp otpEntity = new ForgotPasswordOtp();
        otpEntity.setOtp(otp);
        otpEntity.setUser(user);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otpEntity);

        emailService.sendOtpEmail(email, otp, user.getFullName());
        return "OTP sent to " + email;
    }

    // STEP 2: Check OTP (Doesn't delete, used for UI flow)
    public boolean checkOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        ForgotPasswordOtp otpEntity = otpRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (LocalDateTime.now().isAfter(otpEntity.getExpiresAt())) {
            throw new RuntimeException("OTP has expired");
        }

        if (!otpEntity.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        return true;
    }

    // STEP 3: Verify OTP (Deletes after success)
    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        ForgotPasswordOtp otpEntity = otpRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (LocalDateTime.now().isAfter(otpEntity.getExpiresAt())) {
            otpRepository.delete(otpEntity);
            throw new RuntimeException("OTP has expired");
        }

        if (!otpEntity.getOtp().equals(otp)) {
            otpRepository.delete(otpEntity); // delete on wrong attempt
            throw new RuntimeException("Invalid OTP");
        }

        otpRepository.delete(otpEntity); // delete after verified
        return true;
    }

    // STEP 3: Set new password
    public String resetPassword(String email, String otp,
                                String newPassword, PasswordEncoder encoder) {
        verifyOtp(email, otp);
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
        return "Password reset successfully";
    }
}
