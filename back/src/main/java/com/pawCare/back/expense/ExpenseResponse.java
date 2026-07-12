package com.pawCare.back.expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExpenseResponse(
        Long id,
        Long petId,
        ExpenseCategory category,
        BigDecimal amount,
        LocalDate date,
        String note,
        LocalDateTime createdAt
) {
    public static ExpenseResponse from(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getPet().getId(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getExpenseDate(),
                expense.getNote(),
                expense.getCreatedAt()
        );
    }
}
