package com.library.controller;

import com.library.model.IncomeTransaction;
import com.library.service.IncomeService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<IncomeTransaction> getAllIncome() {
        return incomeService.getAllIncome();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public IncomeTransaction addIncome(@RequestBody IncomeTransaction income) {
        return incomeService.addIncome(income);
    }
}
