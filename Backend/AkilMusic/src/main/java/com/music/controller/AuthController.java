package com.music.controller;

import com.music.dto.RoleDTO;
import com.music.dto.UserDTO;
import com.music.exception.ResourceAlreadyExistsException;
import com.music.exception.ResourceNotFoundException;
import com.music.repository.UserRepository;
import com.music.model.Role;
import com.music.model.User;
import com.music.security.JwtService;
import com.music.service.interfaces.AuthInterface;
import com.music.service.interfaces.BlackListToken;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthInterface authService;
    private final BlackListToken blackListToken;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            UserDTO registeredUser = authService.register(userDTO);
            return ResponseEntity.ok(registeredUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        try {
            UserDTO loggedInUser = authService.login(userDTO);
            return ResponseEntity.ok(loggedInUser);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error during login: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(name = "Authorization") String token ) {
        String jwt = token.substring(7);
        blackListToken.AddToken(jwt);
        return ResponseEntity.ok().body("Successfully logged out");
    }


}
