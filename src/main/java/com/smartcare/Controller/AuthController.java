package com.smartcare.Controller;

import com.smartcare.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> request) {

        String userName = request.get("userName");
        String password = request.get("password");

        Map<String, Object> response =
                authService.login(userName, password);

        Integer status = (Integer) response.get("status");

        return ResponseEntity
                .status(HttpStatus.valueOf(status))
                .body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(
            @RequestBody Map<String, String> request) {

        String userName = request.get("userName");
        String password = request.get("password");
        String role = request.get("role");

        Map<String, Object> response =
                authService.signup(userName, password, role);

        Integer status = (Integer) response.get("status");

        return ResponseEntity
                .status(HttpStatus.valueOf(status))
                .body(response);
    }
}