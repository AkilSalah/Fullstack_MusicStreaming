package com.music.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
// import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChansonDTO {
    @NotNull(message = "L'ID de la chanson ne peut pas être nul.")
    private String id;

    @NotBlank(message = "Le titre de la chanson est obligatoire.")
    @Size(max = 100, message = "Le titre ne peut pas dépasser 100 caractères.")
    private String titre;

    // @NotNull(message = "La durée de la chanson est obligatoire.")
    // @Positive(message = "La durée doit être un entier positif.")
    // private Integer duree;

    // @NotNull(message = "Le numéro de piste est obligatoire.")
    // @Positive(message = "Le numéro de piste doit être un entier positif.")
    // private Integer trackNumber;

    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères.")
    private String description;

    @NotBlank(message = "La catégorie de la chanson est obligatoire.")
    private String category;

    @NotNull(message = "La date de sortie est obligatoire.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotBlank(message = "Le fichier audio est obligatoire.")
    private String audioFile;

    @NotBlank(message = "L'ID de l'album est obligatoire.")
    private String albumId;
}
