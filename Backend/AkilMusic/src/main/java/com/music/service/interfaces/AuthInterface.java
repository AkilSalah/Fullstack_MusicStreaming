package com.music.service.interfaces;

import com.music.dto.UserDTO;

public interface AuthInterface {
        UserDTO register(UserDTO userDTO);
        UserDTO login(UserDTO userDTO);
}
