package com.music.model;

import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

import org.springframework.data.annotation.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
 

@Document(collection = "roles")
@Data
@NoArgsConstructor
public class Role {
    @Id
    private String id;
    private String name;
    
   
    @DBRef(lazy = true)
    private Set<User> users;
}
