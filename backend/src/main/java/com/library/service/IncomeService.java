package com.library.service;

import com.library.model.IncomeTransaction;
import com.library.repository.IncomeTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomeService {

    private final IncomeTransactionRepository incomeRepository;

    public IncomeService(IncomeTransactionRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public List<IncomeTransaction> getAllIncome() {
        return incomeRepository.findAll();
    }

    public IncomeTransaction addIncome(IncomeTransaction income) {
        return incomeRepository.save(income);
    }
}
