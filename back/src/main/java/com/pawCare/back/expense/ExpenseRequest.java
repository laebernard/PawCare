package com.pawCare.back.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        Long petId,
        ExpenseCategory category,
        BigDecimal amount,
        LocalDate date,
        String note
) {
}
