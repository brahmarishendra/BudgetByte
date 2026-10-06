package Backend.BudgetByte.BudgetByte.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.stereotype.Controller;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @GetMapping("/")
    public ResponseEntity<?> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "BudgetByte API Server");
        response.put("version", "1.0.0");
        response.put("endpoints", new String[]{"/api/health", "/api/message", "/api/auth/signup", "/api/auth/login"});
        return ResponseEntity.ok(response);
    }

    @GetMapping("/message")
    public ResponseEntity<?> message(@RequestHeader(value = "Authorization", required = false) String authorization) {
        if (authorization == null || authorization.isBlank()) {
            return ResponseEntity.status(401).body("Authentication required.");
        }
        return ResponseEntity.ok("Session is active.");
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }
}
