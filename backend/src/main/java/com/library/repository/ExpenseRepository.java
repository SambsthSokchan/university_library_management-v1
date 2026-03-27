package com.library.repository;

import com.library.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByCategory(String category);

    @Query("SELECT e FROM Expense e WHERE e.expenseDate BETWEEN :start AND :end")
    List<Expense> findByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT SUM(e.amount) FROM Expense e")
    BigDecimal sumTotalExpenses();
}
