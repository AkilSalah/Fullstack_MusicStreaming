package com.music.dto;

import lombok.Data;

@Data
public class ChansonDTO {
    private String id;
    private String titre;
    private Integer duree;
    private Integer trackNumber;
    private String albumId;
}
