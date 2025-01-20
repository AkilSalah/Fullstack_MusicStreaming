package com.music.mapper;

import com.music.dto.ChansonDTO;
import com.music.model.Chanson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ChansonMapper {
    ChansonMapper INSTANCE = Mappers.getMapper(ChansonMapper.class);

    @Mapping(target = "albumId", source = "album.id")
    ChansonDTO toDto(Chanson chanson);

    @Mapping(target = "album", ignore = true)
    Chanson toEntity(ChansonDTO chansonDTO);
}
