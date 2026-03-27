package com.library.controller;

import com.library.model.StaffPayout;
import com.library.service.StaffPayoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-payouts")
public class StaffPayoutController {

    private final StaffPayoutService payoutService;

    public StaffPayoutController(StaffPayoutService payoutService) {
        this.payoutService = payoutService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<StaffPayout> getAllPayouts() {
        return payoutService.getAllPayouts();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public StaffPayout createPayout(@RequestBody StaffPayout payout) {
        return payoutService.createPayout(payout);
    }

    @PostMapping("/approve/{payoutId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffPayout> approvePayout(@PathVariable Long payoutId) {
        return ResponseEntity.ok(payoutService.approvePayout(payoutId));
    }
}
