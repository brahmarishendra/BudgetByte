package Backend.BudgetByte.BudgetByte.Controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class GlobalErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<?> handleError() {
        Map<String, Object> error = new HashMap<>();
        error.put("status", "error");
        error.put("message", "Endpoint not found or invalid request");
        error.put("api_docs", "https://budgetbyte.onrender.com/api/");
        return ResponseEntity.status(404).body(error);
    }

    public String getErrorPath() {
        return "/error";
    }
}
