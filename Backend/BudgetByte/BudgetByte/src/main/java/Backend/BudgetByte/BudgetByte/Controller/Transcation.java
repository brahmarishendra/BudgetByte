package Backend.BudgetByte.BudgetByte.Controller;

import java.util.Map;
import java.util.Optional;
import Backend.BudgetByte.BudgetByte.Model.Database_Entity.Users;
import Backend.BudgetByte.BudgetByte.repository.DatabaseAccess.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Backend.BudgetByte.BudgetByte.Model.Database_Entity.Payments.Transactions;
import Backend.BudgetByte.BudgetByte.repository.DatabaseAccess.TranscationRepository;

@RestController
@RequestMapping({"/api/transcation", "/api/transaction"})
@CrossOrigin(origins = "*")
public class Transcation {

    @Autowired
    private TranscationRepository transcationRepository;

    @Autowired
    private UserRepository userRepository;

    private Optional<Users> getUser(String userId) {
        if (userId == null || userId.isBlank()) return Optional.empty();
        try {
            return userRepository.findById(Long.valueOf(userId));
        } catch (NumberFormatException exception) {
            return Optional.empty();
        }
    }

    private boolean belongsToUser(Transactions transaction, Users user) {
        return transaction.getUserId() != null
                && transaction.getUserId().getId().equals(user.getId());
    }

    // Add, Get, Update, Delete Transcation APIs

    @PostMapping("/add")
    public ResponseEntity<?> addTranscation(@RequestHeader(value = "X-User-Id", required = false) String userId, @RequestBody Map<String, Object> transcationRequest) {
        Optional<Users> user = getUser(userId);
        if (user.isEmpty()) return ResponseEntity.status(401).body("User authentication required.");
        
        String type = (String) transcationRequest.getOrDefault("type", "expense");
        double amount = 0.0;
        try {
            amount = Double.parseDouble(String.valueOf(transcationRequest.get("amount")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid amount value.");
        }
        
        String category = (String) transcationRequest.getOrDefault("category", "General");
        String description = (String) transcationRequest.getOrDefault("description", "");
        String date = (String) transcationRequest.getOrDefault("date", java.time.LocalDate.now().toString());
        String comments = (String) transcationRequest.getOrDefault("comments", "");

        Transactions transactions = new Transactions(type, amount, category, description, date, user.get());
        transactions.setComments(comments);
        this.transcationRepository.save(transactions);

        return ResponseEntity.ok("Transcation added successfully!");
    }

    @GetMapping
    public ResponseEntity<?> getAllTranscations(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        Optional<Users> user = getUser(userId);
        if (user.isEmpty()) return ResponseEntity.status(401).body("User authentication required.");
        return ResponseEntity.ok(this.transcationRepository.findByUserId_Id(user.get().getId()));
    }

    @PostMapping("/get")
    public ResponseEntity<?> getTranscation(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        return getAllTranscations(userId);
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteTranscation(@RequestHeader(value = "X-User-Id", required = false) String userId, @RequestBody Map<String, Object> transcationRequest) {
        Optional<Users> user = getUser(userId);
        if (user.isEmpty()) return ResponseEntity.status(401).body("User authentication required.");
        Long id = Long.parseLong(String.valueOf(transcationRequest.get("id")));
        Optional<Transactions> transaction = this.transcationRepository.findById(id);
        if (transaction.isEmpty() || !belongsToUser(transaction.get(), user.get())) {
            return ResponseEntity.status(404).body("Transcation not found!");
        }
        this.transcationRepository.deleteById(id);
        return ResponseEntity.ok("Transcation deleted successfully!");
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateTranscation(@RequestHeader(value = "X-User-Id", required = false) String userId, @RequestBody Map<String, Object> transcationRequest) {
        Optional<Users> user = getUser(userId);
        if (user.isEmpty()) return ResponseEntity.status(401).body("User authentication required.");
        
        Long id;
        try {
            id = Long.parseLong(String.valueOf(transcationRequest.get("id")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid transaction ID.");
        }

        String type = (String) transcationRequest.getOrDefault("type", "expense");
        double amount = 0.0;
        try {
            amount = Double.parseDouble(String.valueOf(transcationRequest.get("amount")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid amount.");
        }
        
        String category = (String) transcationRequest.getOrDefault("category", "General");
        String description = (String) transcationRequest.getOrDefault("description", "");
        String date = (String) transcationRequest.getOrDefault("date", java.time.LocalDate.now().toString());
        String comments = (String) transcationRequest.getOrDefault("comments", "");

        Optional<Transactions> optionalTransaction = this.transcationRepository.findById(id);
        if (optionalTransaction.isEmpty() || !belongsToUser(optionalTransaction.get(), user.get())) {
            return ResponseEntity.status(404).body("Transcation not found!");
        }

        Transactions transactions = optionalTransaction.get();
        transactions.setType(type);
        transactions.setAmount(amount);
        transactions.setCategory(category);
        transactions.setDescription(description);
        transactions.setDate(date);
        transactions.setComments(comments);

        this.transcationRepository.save(transactions);
        return ResponseEntity.ok("Transcation updated successfully!");
    }

    /* searchTranscation(@RequestBody Map<String, Object> transcationRequest) {
        String keyword = (String) transcationRequest.get("keyword");
        return ResponseEntity.ok(this.transcationRepository.findByCategoryContainingIgnoreCase(keyword));
    }
    */
}