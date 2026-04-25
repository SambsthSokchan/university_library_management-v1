package com.library.controller;

import com.library.model.ClearanceRequest;
import com.library.service.ClearanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clearance")
public class ClearanceController {

    private final ClearanceService clearanceService;

    public ClearanceController(ClearanceService clearanceService) {
        this.clearanceService = clearanceService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<ClearanceRequest> getAllRequests() {
        return clearanceService.getAllRequests();
    }

    @PostMapping("/request")
    public ClearanceRequest requestClearance(@RequestParam Long memberId, @RequestParam String reason) {
        return clearanceService.requestClearance(memberId, reason);
    }

    @PostMapping("/review/{requestId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ClearanceRequest> reviewRequest(
            @PathVariable Long requestId,
            @RequestParam ClearanceRequest.ClearanceStatus status,
            @RequestParam(required = false) String note) {
        return ResponseEntity.ok(clearanceService.reviewRequest(requestId, status, note));
    }
}
