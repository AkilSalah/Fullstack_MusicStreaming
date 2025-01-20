package com.music.controller;

import com.music.dto.AlbumDTO;
import com.music.repository.AlbumRepository;
import com.music.model.Album;
import com.music.service.interfaces.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    @GetMapping("/user/albums")
    public ResponseEntity<?> getAllAlbums(
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        try {
            Page<AlbumDTO> albums = albumService.getAllAlbums(pageable);
            return ResponseEntity.ok(albums);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error fetching albums: " + e.getMessage());
        }
    }

    @GetMapping("/user/albums/search/title")
    public ResponseEntity<?> searchAlbumsByTitle(
            @RequestParam String titre,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        try {
            Page<AlbumDTO> albums = albumService.searchAlbumsByTitle(titre, pageable);
            return ResponseEntity.ok(albums);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error searching albums by title: " + e.getMessage());
        }
    }

    @GetMapping("/user/albums/search/artist")
    public ResponseEntity<?> searchAlbumsByArtist(
            @RequestParam String artiste,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        try {
            Page<AlbumDTO> albums = albumService.searchAlbumsByArtist(artiste, pageable);
            return ResponseEntity.ok(albums);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error searching albums by artist: " + e.getMessage());
        }
    }

    @GetMapping("/user/albums/filter/year")
    public ResponseEntity<?> filterAlbumsByYear(
            @RequestParam Integer annee,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        try {
            Page<AlbumDTO> albums = albumService.filterAlbumsByYear(annee, pageable);
            return ResponseEntity.ok(albums);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error filtering albums by year: " + e.getMessage());
        }
    }

    @GetMapping("/user/albums/{id}")
    public ResponseEntity<?> getAlbumById(@PathVariable String id) {
        try {
            AlbumDTO album = albumService.getAlbumById(id);
            return ResponseEntity.ok(album);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error fetching album by ID: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/albums")
    public ResponseEntity<?> createAlbum(@RequestBody AlbumDTO albumDTO) {
        try {
            AlbumDTO createdAlbum = albumService.createAlbum(albumDTO);
            return ResponseEntity.ok(createdAlbum);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error creating album: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/albums/{id}")
    public ResponseEntity<?> updateAlbum(
            @PathVariable String id,
            @RequestBody AlbumDTO albumDTO) {
        try {
            AlbumDTO updatedAlbum = albumService.updateAlbum(id, albumDTO);
            return ResponseEntity.ok(updatedAlbum);
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error updating album: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/albums/{id}")
    public ResponseEntity<?> deleteAlbum(@PathVariable String id) {
        try {
            albumService.deleteAlbum(id);
            return ResponseEntity.ok("Album deleted successfully");
        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("Error deleting album: " + e.getMessage());
        }
    }
}