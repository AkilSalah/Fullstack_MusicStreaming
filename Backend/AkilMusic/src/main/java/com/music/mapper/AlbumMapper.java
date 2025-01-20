package com.music.mapper;

import com.music.dto.AlbumDTO;
import com.music.model.Album;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ChansonMapper.class})
public interface AlbumMapper {

    @Mapping(target = "chansons", source = "chansons")
    AlbumDTO toDto(Album album);

    @Mapping(target = "chansons", source = "chansons")
    Album toEntity(AlbumDTO albumDTO);
}
