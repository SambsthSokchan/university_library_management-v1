package com.library.service;

import com.library.model.StaffPayout;
import com.library.model.User;
import com.library.repository.StaffPayoutRepository;
import com.library.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StaffPayoutService {

    private final StaffPayoutRepository payoutRepository;
    private final UserRepository userRepository;

    public StaffPayoutService(StaffPayoutRepository payoutRepository, UserRepository userRepository) {
        this.payoutRepository = payoutRepository;
        this.userRepository = userRepository;
    }

    public List<StaffPayout> getAllPayouts() {
        return payoutRepository.findAll();
    }

    public StaffPayout createPayout(StaffPayout payout) {
        return payoutRepository.save(payout);
    }

    @Transactional
    public StaffPayout approvePayout(Long payoutId) {
        StaffPayout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new RuntimeException("Payout not found"));

        String adminUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByUsername(adminUsername).orElseThrow(() -> new RuntimeException("Admin not found"));

        payout.setStatus(StaffPayout.PayoutStatus.PAID);
        payout.setPaidAt(LocalDateTime.now());
        payout.setApprovedBy(admin);

        return payoutRepository.save(payout);
    }
}
