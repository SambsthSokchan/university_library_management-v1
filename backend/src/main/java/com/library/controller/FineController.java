package com.library.controller;

import com.library.model.Fine;
import com.library.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @GetMapping
    public List<Fine> getAllFines() {
        return fineService.getAllFines();
    }

    @GetMapping("/member/{memberId}")
    public List<Fine> getMemberFines(@PathVariable Long memberId) {
        return fineService.getMemberFines(memberId);
    }

    @PostMapping("/pay/{fineId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Fine> payFine(@PathVariable Long fineId) {
        return ResponseEntity.ok(fineService.payFine(fineId));
    }
}
