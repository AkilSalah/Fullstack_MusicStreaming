package com.music.dto;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChansonDTO {
    private String id;

    @NotBlank(message = "Le titre de la chanson est obligatoire.")
    @Size(max = 100, message = "Le titre ne peut pas dépasser 100 caractères.")
    private String titre;

    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères.")
    private String description;

    @NotBlank(message = "La catégorie de la chanson est obligatoire.")
    private String category;

    @NotNull(message = "La date de sortie est obligatoire.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull(message = "Le fichier audio est obligatoire.")
    private String audioFile;

    @NotBlank(message = "L'ID de l'album est obligatoire.")
    private String albumId;
}