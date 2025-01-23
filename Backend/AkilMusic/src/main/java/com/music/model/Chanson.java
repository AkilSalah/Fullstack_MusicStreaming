package com.music.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;

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
    private String description;
    private String category;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String audioFile;

    @DBRef
    @NotNull(message = "L'album est obligatoire")
    private Album album;
}
