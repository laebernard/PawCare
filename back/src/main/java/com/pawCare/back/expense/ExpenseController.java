package com.pawCare.back.expense;

import com.pawCare.back.user.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExpenseResponse> getExpenses(
            @AuthenticationPrincipal User currentUser,
            @RequestParam Long petId,
            @RequestParam(required = false) String month
    ) {
        return service.getExpenses(currentUser, petId, month).stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    @PostMapping
    public ExpenseResponse createExpense(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ExpenseRequest request
    ) {
        return ExpenseResponse.from(service.createExpense(currentUser, request));
    }
}
