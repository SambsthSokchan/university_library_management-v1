package com.library.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("RUA Finance <" + fromEmail + ">");
            helper.setTo(toEmail);   // ✅ sends to user's email
            helper.setSubject("Your OTP Code — RUA Finance");
            helper.setText(buildHtml(fullName, otp), true);

            mailSender.send(message);
            System.out.println("✅ Email sent successfully to: " + toEmail);

        } catch (Exception e) {
            System.out.println("❌ EMAIL FAILED: " + e.getMessage());
            System.out.println("📋 OTP for " + toEmail + " is: " + otp);
        }
    }

    private String buildHtml(String name, String otp) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:500px;
                        margin:auto;padding:32px;border:1px solid #e5e7eb;
                        border-radius:12px;">
              <h2 style="color:#16a34a;">🏫 RUA Finance System</h2>
              <p>Hello <strong>%s</strong>,</p>
              <p>Your password reset OTP code is:</p>
              <div style="font-size:40px;font-weight:bold;
                          letter-spacing:16px;color:#16a34a;
                          padding:20px 0;text-align:center;">
                %s
              </div>
              <p style="color:#6b7280;font-size:13px;">
                ⏱ Expires in <strong>5 minutes</strong>.<br/>
                🔒 Do not share this code with anyone.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
              <p style="color:#9ca3af;font-size:11px;text-align:center;">
                © 2026 Royal University of Agriculture. All rights reserved.
              </p>
            </div>
        """.formatted(name, otp);
    }
}
