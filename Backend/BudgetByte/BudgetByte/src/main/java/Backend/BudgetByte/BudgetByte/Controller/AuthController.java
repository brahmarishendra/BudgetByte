package Backend.BudgetByte.BudgetByte.Controller;

import Backend.BudgetByte.BudgetByte.Model.Database_Entity.Users;
import Backend.BudgetByte.BudgetByte.repository.DatabaseAccess.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. Signup API: POST http://localhost:8080/api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signupRequest) {
        String email = signupRequest.get("email");
        String password = signupRequest.get("password");
        String fullName = signupRequest.get("fullName" 
        );

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("An account with this email already exists.");
        }

        Users user = new Users();
        user.setEmail(email);
        user.setUsername(fullName != null && !fullName.trim().isEmpty() ? fullName : email);
        user.setPassword(password);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    // 2. Login API: POST http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        Optional<Users> userOpt = userRepository.findByEmailAndPassword(email, password);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            Map<String, Object> loginResponse = new HashMap<>();
            loginResponse.put("message", "Login successful!");
            loginResponse.put("userId", user.getId());
            loginResponse.put("email", user.getEmail());
            loginResponse.put("username", user.getUsername() != null ? user.getUsername() : user.getEmail().split("@")[0]);
            return ResponseEntity.ok(loginResponse);
        }
        return ResponseEntity.status(401).body("Invalid email or password.");
    }

    @GetMapping("/message")
    public ResponseEntity<?> message(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || authorization.isBlank()) {
            return ResponseEntity.status(401).body("Authentication required.");
        }
        return ResponseEntity.ok("Session is active.");
    }
}
