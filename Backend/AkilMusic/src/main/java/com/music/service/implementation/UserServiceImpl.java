package com.music.service.implementation;

import com.music.dto.UserDTO;
import com.music.repository.RoleRepo;
import com.music.repository.UserRepository;
import com.music.mapper.UserMapper;
import com.music.model.Role;
import com.music.model.User;
import com.music.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepo roleRepo;

    @Override
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toDto);
    }

    @Override
    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDto(user);
    }

    @Override
    public UserDTO updateUserRoles(String id, Set<String> roleNames) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Role> roles = roleNames.stream()
                .map(name -> roleRepo.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + name)))
                .collect(Collectors.toSet());

        System.out.println("Les rôles sont : " + roles);

        user.setRoles(roles);
        User updatedUser = userRepository.save(user);

        return userMapper.toDto(updatedUser);
    }


    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
