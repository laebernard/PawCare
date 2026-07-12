package com.pawCare.back.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdAndPetIdOrderByExpenseDateDescCreatedAtDesc(Long userId, Long petId);

    List<Expense> findByUserIdAndPetIdAndExpenseDateBetweenOrderByExpenseDateDescCreatedAtDesc(
            Long userId,
            Long petId,
            LocalDate startDate,
            LocalDate endDate
    );
}
