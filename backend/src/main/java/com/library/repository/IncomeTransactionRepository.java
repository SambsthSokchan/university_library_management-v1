package com.library.repository;

import com.library.model.IncomeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IncomeTransactionRepository extends JpaRepository<IncomeTransaction, Long> {
    List<IncomeTransaction> findBySource(IncomeTransaction.IncomeSource source);

    @Query("SELECT i FROM IncomeTransaction i WHERE i.transactionDate BETWEEN :start AND :end")
    List<IncomeTransaction> findByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT SUM(i.amount) FROM IncomeTransaction i")
    BigDecimal sumTotalIncome();
}
