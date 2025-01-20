package com.music.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.util.List;

@Document(collection = "albums")
@Data
@NoArgsConstructor
public class Album {
    @Id
    private String id;
    private String titre;
    private String artiste;
    private int annee;
    
    @DBRef(lazy = true)
    private List<Chanson> chansons;
}
