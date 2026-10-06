package Backend.BudgetByte.BudgetByte.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<?> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "BudgetByte Backend API");
        response.put("version", "1.0.0");
        response.put("endpoints", new String[]{
            "/health",
            "/actuator/health",
            "/api/",
            "/api/auth/signup",
            "/api/auth/login",
            "/api/transaction"
        });
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/health", "/actuator/health"})
    public ResponseEntity<?> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }
}
