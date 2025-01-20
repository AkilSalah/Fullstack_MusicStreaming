package com.music.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Data
@NoArgsConstructor
@Document(collection = "chansons")
public class Chanson {
    @Id
    private String id;
    private String titre;
    private Integer duree;  
    private Integer trackNumber;
    
    @DBRef(lazy = true)
    private Album album;
}
