package com.music.service.interfaces;

import com.music.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Set;

public interface UserService {
    Page<UserDTO> getAllUsers(Pageable pageable);
    UserDTO getUserById(String id);
    UserDTO updateUserRoles(String id, Set<String> roleNames);
    void deleteUser(String id);
}
