package com.music.mapper;

import com.music.dto.ChansonDTO;
import com.music.model.Chanson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChansonMapper {
    @Mapping(target = "albumId", source = "album.id") 
    ChansonDTO toDto(Chanson chanson);

    @Mapping(target = "album", ignore = true) 
    Chanson toEntity(ChansonDTO chansonDTO);
}

