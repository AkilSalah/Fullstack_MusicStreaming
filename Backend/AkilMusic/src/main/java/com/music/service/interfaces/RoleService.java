package com.music.service.interfaces;

import com.music.dto.RoleDTO;
import java.util.List;

public interface RoleService {
    List<RoleDTO> getRoles();
    RoleDTO addRole(RoleDTO role);
}
