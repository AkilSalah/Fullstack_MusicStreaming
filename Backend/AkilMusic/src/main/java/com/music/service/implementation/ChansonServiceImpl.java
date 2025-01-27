package com.music.service.implementation;

import com.music.dto.ChansonDTO;
import com.music.repository.AlbumRepository;
import com.music.repository.ChansonRepository;
import com.music.service.interfaces.ChansonService;
import com.music.mapper.ChansonMapper;
import com.music.model.Album;
import com.music.model.Chanson;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChansonServiceImpl implements ChansonService {

    private final ChansonRepository chansonRepository;
    private final ChansonMapper chansonMapper;
    private final AlbumRepository albumRepository;

    @Override
    public Page<ChansonDTO> getAllChansons(Pageable pageable) {
        return chansonRepository.findAll(pageable)
                .map(chansonMapper::toDto);
    }

    @Override
    public Page<ChansonDTO> searchChansonsByTitle(String titre, Pageable pageable) {
        return chansonRepository.findByTitreContainingIgnoreCase(titre, pageable)
                .map(chansonMapper::toDto);
    }

    @Override
    public Page<ChansonDTO> getChansonsByAlbum(String albumId, Pageable pageable) {
        return chansonRepository.findByAlbumId(albumId, pageable)
                .map(chansonMapper::toDto);
    }

    @Override
    public ChansonDTO getChansonById(String id) {
        Chanson chanson = chansonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chanson not found"));
        return chansonMapper.toDto(chanson);
    }

    @Override
    public ChansonDTO createChanson(ChansonDTO chansonDTO) {
    Album album = albumRepository.findById(chansonDTO.getAlbumId())
        .orElseThrow(() -> new RuntimeException("Album not found"));

    Chanson chanson = chansonMapper.toEntity(chansonDTO);
    chanson.setAlbum(album);
    Chanson savedChanson = chansonRepository.save(chanson);

    ChansonDTO responseDTO = chansonMapper.toDto(savedChanson);
    responseDTO.setAlbumId(album.getId());
    return responseDTO;
    }


    @Override
    public ChansonDTO updateChanson(String id, ChansonDTO chansonDTO) {
        Album album = albumRepository.findById(chansonDTO.getAlbumId())
        .orElseThrow(() -> new RuntimeException("Album not found"));

        if (!chansonRepository.existsById(id)) {
            throw new RuntimeException("Chanson not found");
        }
        Chanson chanson = chansonMapper.toEntity(chansonDTO);
        chanson.setAlbum(album);
        chanson.setId(id);
        Chanson updatedChanson = chansonRepository.save(chanson);
        ChansonDTO resDto = chansonMapper.toDto(updatedChanson);
        resDto.setAlbumId(album.getId());
        return resDto;
    }

    @Override
    public void deleteChanson(String id) {
        if (!chansonRepository.existsById(id)) {
            throw new RuntimeException("Chanson not found");
        }
        chansonRepository.deleteById(id);
    }
}
