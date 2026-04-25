package com.library.service;

import com.library.dto.DashboardSummary;
import com.library.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final MemberRepository memberRepository;
    private final IncomeTransactionRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final ClearanceRequestRepository clearanceRepository;

    public DashboardService(MemberRepository memberRepository, 
                            IncomeTransactionRepository incomeRepository, 
                            ExpenseRepository expenseRepository, ClearanceRequestRepository clearanceRepository) {
        this.memberRepository = memberRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.clearanceRepository = clearanceRepository;
    }

    public DashboardSummary getSummary() {
        long totalMembers = memberRepository.count();
        
        BigDecimal totalIncome = incomeRepository.findAll().stream()
                .map(com.library.model.IncomeTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalExpenses = expenseRepository.findAll().stream()
                .map(com.library.model.Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingClearances = clearanceRepository.findAll().stream()
                .filter(c -> c.getStatus() == com.library.model.ClearanceRequest.ClearanceStatus.PENDING)
                .count();

        return DashboardSummary.builder()
                .totalMembers(totalMembers)
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(totalIncome.subtract(totalExpenses))
                .pendingClearances(pendingClearances)
                .build();
    }
}
