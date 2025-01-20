package com.music.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.music.model.User;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByLogin(String login);
    boolean existsByLogin(String login);
}
