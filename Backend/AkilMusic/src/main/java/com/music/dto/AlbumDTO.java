package com.music.dto;

import lombok.Data;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class AlbumDTO {
    @NotNull(message = "L'ID de l'album ne peut pas être nul.")
    private String id;

    @NotBlank(message = "Le titre de l'album est obligatoire.")
    @Size(max = 100, message = "Le titre de l'album ne peut pas dépasser 100 caractères.")
    private String titre;

    @NotBlank(message = "Le nom de l'artiste est obligatoire.")
    @Size(max = 100, message = "Le nom de l'artiste ne peut pas dépasser 100 caractères.")
    private String artiste;

    @NotNull(message = "L'année de l'album est obligatoire.")
    @Min(value = 1900, message = "L'année doit être au moins 1900.")
    @Max(value = 2100, message = "L'année ne peut pas dépasser 2100.")
    private Integer annee;

    @NotNull(message = "La liste des chansons ne peut pas être nulle.")
    @Size(min = 1, message = "Un album doit contenir au moins une chanson.")
    private List<@Valid ChansonDTO> chansons;
}
