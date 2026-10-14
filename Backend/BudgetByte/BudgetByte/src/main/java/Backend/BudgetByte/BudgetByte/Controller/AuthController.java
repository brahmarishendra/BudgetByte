package Backend.BudgetByte.BudgetByte.Controller;

import Backend.BudgetByte.BudgetByte.Model.Database_Entity.Users;
import Backend.BudgetByte.BudgetByte.repository.DatabaseAccess.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Helper for hashing password with SHA-256
    private String hashPassword(String rawPassword) {
        if (rawPassword == null) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return rawPassword;
        }
    }

    // 1. Signup API: POST http://localhost:8080/api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signupRequest) {
        String email = signupRequest.get("email");
        String password = signupRequest.get("password");
        String fullName = signupRequest.get("fullName");
        String verifiedStr = signupRequest.get("Verified");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("An account with this email already exists.");
        }

        Users user = new Users();
        user.setEmail(email);
        user.setUsername(fullName != null && !fullName.trim().isEmpty() ? fullName : email);
        user.setPassword(hashPassword(password)); // Store hashed password
        user.setVerified("true".equalsIgnoreCase(verifiedStr));

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

        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            String storedPassword = user.getPassword();
            String hashedInput = hashPassword(password);

            // Matches either hashed password or legacy plain text (backward compatibility)
            if (storedPassword.equals(hashedInput) || storedPassword.equals(password)) {
                // Auto-upgrade legacy plain-text password to hash in DB
                if (storedPassword.equals(password)) {
                    user.setPassword(hashedInput);
                    userRepository.save(user);
                }

                Map<String, Object> loginResponse = new HashMap<>();
                loginResponse.put("message", "Login successful!");
                loginResponse.put("userId", user.getId());
                loginResponse.put("email", user.getEmail());
                loginResponse.put("username", user.getUsername() != null ? user.getUsername() : user.getEmail().split("@")[0]);
                loginResponse.put("Verified", user.getVerified());
                return ResponseEntity.ok(loginResponse);
            }
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

    // 3. Send Verification Code API
    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        // Generate a 6-digit verification code
        int code = 100000 + (int)(Math.random() * 900000);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Verification code sent to " + email);
        response.put("code", String.valueOf(code));
        return ResponseEntity.ok(response);
    }

    // 4. Verify Email API
    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            user.setVerified(true);
            userRepository.save(user);
            return ResponseEntity.ok("Email verified successfully!");
        }

        return ResponseEntity.ok("Email verified successfully!");
    }

    // 5. Forgot Password / Reset Password API
    @PostMapping("/forgot-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (email == null || email.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and new password are required.");
        }

        if (newPassword.length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long.");
        }

        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            user.setPassword(hashPassword(newPassword));
            user.setVerified(true);
            userRepository.save(user);
            return ResponseEntity.ok("Password reset successfully!");
        }

        return ResponseEntity.status(404).body("No account found with this email address.");
    }







}
