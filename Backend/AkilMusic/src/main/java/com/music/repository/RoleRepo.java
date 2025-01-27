package com.music.repository;

import com.music.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RoleRepo extends MongoRepository<Role, String> {
    Optional<Role> findByName(String name);
}

