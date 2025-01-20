package com.music.service.implementation;

import com.music.dto.AlbumDTO;
import com.music.exception.ResourceNotFoundException;
import com.music.repository.AlbumRepository;
import com.music.mapper.AlbumMapper;
import com.music.model.Album;
import com.music.service.interfaces.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {
    
    private final AlbumRepository albumRepository;
    private final AlbumMapper albumMapper;

    @Override
    public Page<AlbumDTO> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable)
                .map(albumMapper::toDto);
    }

    @Override
    public Page<AlbumDTO> searchAlbumsByTitle(String titre, Pageable pageable) {
        return albumRepository.findByTitreContainingIgnoreCase(titre, pageable)
                .map(albumMapper::toDto);
    }

    @Override
    public Page<AlbumDTO> searchAlbumsByArtist(String artiste, Pageable pageable) {
        return albumRepository.findByArtisteContainingIgnoreCase(artiste, pageable)
                .map(albumMapper::toDto);
    }

    @Override
    public Page<AlbumDTO> filterAlbumsByYear(Integer annee, Pageable pageable) {
        return albumRepository.findByAnnee(annee, pageable)
                .map(albumMapper::toDto);
    }

    @Override
    public AlbumDTO getAlbumById(String id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + id));
        if (album.getChansons() != null) {
            album.getChansons().size();
        }
        return albumMapper.toDto(album);
    }

    @Override
    public AlbumDTO createAlbum(AlbumDTO albumDTO) {
        Album album = albumMapper.toEntity(albumDTO);
        Album savedAlbum = albumRepository.save(album);
        return albumMapper.toDto(savedAlbum);
    }

    @Override
    public AlbumDTO updateAlbum(String id, AlbumDTO albumDTO) {
        if (!albumRepository.existsById(id)) {
            throw new RuntimeException("Album not found");
        }
        Album album = albumMapper.toEntity(albumDTO);
        album.setId(id);
        Album updatedAlbum = albumRepository.save(album);
        return albumMapper.toDto(updatedAlbum);
    }

    @Override
    public void deleteAlbum(String id) {
        if (!albumRepository.existsById(id)) {
            throw new RuntimeException("Album not found");
        }
        albumRepository.deleteById(id);
    }
}
