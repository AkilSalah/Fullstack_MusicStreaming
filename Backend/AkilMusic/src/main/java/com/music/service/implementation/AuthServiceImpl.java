package com.music.service.implementation;

import com.music.dto.RoleDTO;
import com.music.dto.UserDTO;
import com.music.exception.ResourceNotFoundException;
import com.music.model.Role;
import com.music.model.User;
import com.music.repository.UserRepository;
import com.music.security.JwtService;
import com.music.service.interfaces.AuthInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthInterface {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MongoTemplate mongoTemplate;

    @Override
    public UserDTO register(UserDTO userDTO) {
        if (userRepository.existsByLogin(userDTO.getLogin())) {
            throw new IllegalArgumentException("Username already exists");
        }

        List<Role> existingRoles = mongoTemplate.find(
                Query.query(Criteria.where("name").in(userDTO.getRoleNames())),
                Role.class,
                "roles"
        );

        if (existingRoles.size() != userDTO.getRoleNames().size()) {
            throw new IllegalArgumentException("One or more roles do not exist");
        }

        User user = new User();
        user.setLogin(userDTO.getLogin());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setActive(true);
        user.setRoles(new HashSet<>(existingRoles));
        user = userRepository.save(user);

        String token = jwtService.generateToken(user);

        return UserDTO.builder()
                .id(user.getId())
                .login(user.getLogin())
                .active(user.isEnabled())
                .roles(existingRoles.stream()
                        .map(role -> new RoleDTO(role.getId(), role.getName()))
                        .collect(Collectors.toSet()))
                .token(token)
                .build();
    }

    @Override
    public UserDTO login(UserDTO userDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDTO.getLogin(), userDTO.getPassword())
        );

        User user = userRepository.findByLogin(userDTO.getLogin())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtService.generateToken(user);

        return UserDTO.builder()
                .id(user.getId())
                .login(user.getLogin())
                .active(user.isEnabled())
                .roles(user.getRoles().stream()
                        .map(role -> new RoleDTO(role.getId(), role.getName()))
                        .collect(Collectors.toSet()))
                .token(token)
                .build();
    }
}
