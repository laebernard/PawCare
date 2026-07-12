package com.pawCare.back.expense;

import com.pawCare.back.pet.Pet;
import com.pawCare.back.pet.PetService;
import com.pawCare.back.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;
    private final PetService petService;

    public ExpenseService(ExpenseRepository repository, PetService petService) {
        this.repository = repository;
        this.petService = petService;
    }

    public List<Expense> getExpenses(User currentUser, Long petId, String month) {
        if (petId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "petId is required");
        }

        Pet pet = petService.getPetById(petId, currentUser);

        if (month == null || month.isBlank()) {
            return repository.findByUserIdAndPetIdOrderByExpenseDateDescCreatedAtDesc(currentUser.getId(), pet.getId());
        }

        try {
            YearMonth yearMonth = YearMonth.parse(month);
            return repository.findByUserIdAndPetIdAndExpenseDateBetweenOrderByExpenseDateDescCreatedAtDesc(
                    currentUser.getId(),
                    pet.getId(),
                    yearMonth.atDay(1),
                    yearMonth.atEndOfMonth()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid month format. Expected yyyy-MM");
        }
    }

    public Expense createExpense(User currentUser, ExpenseRequest request) {
        if (request == null || request.petId() == null || request.category() == null || request.amount() == null || request.date() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields are required: petId, category, amount, date");
        }

        BigDecimal amount = request.amount();
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be a positive number");
        }

        Pet pet = petService.getPetById(request.petId(), currentUser);
        Expense expense = new Expense(
                currentUser,
                pet,
                request.category(),
                amount,
                request.date(),
                request.note() != null ? request.note().trim() : null
        );

        return repository.save(expense);
    }
}
