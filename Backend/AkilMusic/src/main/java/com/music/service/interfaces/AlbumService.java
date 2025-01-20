package com.music.service.interfaces;

import com.music.dto.AlbumDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AlbumService {
    Page<AlbumDTO> getAllAlbums(Pageable pageable);
    Page<AlbumDTO> searchAlbumsByTitle(String titre, Pageable pageable);
    Page<AlbumDTO> searchAlbumsByArtist(String artiste, Pageable pageable);
    Page<AlbumDTO> filterAlbumsByYear(Integer annee, Pageable pageable);
    AlbumDTO getAlbumById(String id);
    AlbumDTO createAlbum(AlbumDTO albumDTO);
    AlbumDTO updateAlbum(String id, AlbumDTO albumDTO);
    void deleteAlbum(String id);
}
