package com.smartcare.Services;

import com.smartcare.Entity.UserEntity;
import com.smartcare.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> login(String userName, String password) {

        Map<String, Object> response = new HashMap<>();


        if (userName == null || userName.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username is required");
            response.put("error", "USERNAME_REQUIRED");
            response.put("status", 400);
            return response;
        }

        if (password == null || password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required");
            response.put("error", "PASSWORD_REQUIRED");
            response.put("status", 400);
            return response;
        }

        UserEntity user = userRepository.findByUserName(userName)
                .orElse(null);

        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found");
            response.put("error", "USER_NOT_FOUND");
            response.put("status", 404);
            return response;
        }

        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Invalid password");
            response.put("error", "INVALID_PASSWORD");
            response.put("status", 401);
            return response;
        }


        response.put("success", true);
        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("userName", user.getUserName());
        response.put("role", user.getRole());
        response.put("status", 200);

        return response;
    }

    public Map<String, Object> signup(String userName, String password, String role) {

        Map<String, Object> response = new HashMap<>();

        if (userName == null || userName.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username is required");
            response.put("error", "USERNAME_REQUIRED");
            response.put("status", 400);
            return response;
        }


        if (password == null || password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required");
            response.put("error", "PASSWORD_REQUIRED");
            response.put("status", 400);
            return response;
        }


        if (userRepository.existsByUserName(userName)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            response.put("error", "USERNAME_EXISTS");
            response.put("status", 409);
            return response;
        }

        UserEntity user = new UserEntity();

        user.setUserName(userName);
        user.setPassword(password);


        if (role == null || role.trim().isEmpty()) {
            user.setRole("USER");
        } else {
            user.setRole(role);
        }

        UserEntity savedUser = userRepository.save(user);

        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("userId", savedUser.getId());
        response.put("userName", savedUser.getUserName());
        response.put("role", savedUser.getRole());
        response.put("status", 201);

        return response;
    }
}