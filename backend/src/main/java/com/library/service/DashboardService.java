package com.library.service;

import com.library.dto.DashboardSummary;
import com.library.model.BorrowRecord;
import com.library.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final BorrowRecordRepository borrowRepository;
    private final IncomeTransactionRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final ClearanceRequestRepository clearanceRepository;

    public DashboardService(BookRepository bookRepository, MemberRepository memberRepository, 
                            BorrowRecordRepository borrowRepository, IncomeTransactionRepository incomeRepository, 
                            ExpenseRepository expenseRepository, ClearanceRequestRepository clearanceRepository) {
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.borrowRepository = borrowRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.clearanceRepository = clearanceRepository;
    }

    public DashboardSummary getSummary() {
        long totalBooks = bookRepository.count();
        long totalMembers = memberRepository.count();
        long borrowedBooks = borrowRepository.countByStatus(BorrowRecord.Status.BORROWED);
        long overdueBooks = borrowRepository.countByStatus(BorrowRecord.Status.OVERDUE);
        
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
                .totalBooks(totalBooks)
                .totalMembers(totalMembers)
                .activeBorrows(borrowedBooks)
                .overdueBorrows(overdueBooks)
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(totalIncome.subtract(totalExpenses))
                .pendingClearances(pendingClearances)
                .build();
    }
}
