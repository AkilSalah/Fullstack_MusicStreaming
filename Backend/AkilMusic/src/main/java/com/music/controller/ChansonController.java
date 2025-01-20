package com.music.controller;

import com.music.dto.ChansonDTO;
import com.music.service.interfaces.ChansonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ChansonController {

    private final ChansonService chansonService;

    // User endpoints
    @GetMapping("/api/user/songs")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<ChansonDTO>> getAllChansons(
            @PageableDefault(sort = "titre", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(chansonService.getAllChansons(pageable));
    }

    @GetMapping("/api/user/songs/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<ChansonDTO>> searchChansonsByTitle(
            @RequestParam String titre,
            @PageableDefault(sort = "titre", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(chansonService.searchChansonsByTitle(titre, pageable));
    }

    @GetMapping("/api/user/songs/album/{albumId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Page<ChansonDTO>> getChansonsByAlbum(
            @PathVariable String albumId,
            @PageableDefault(sort = "trackNumber", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(chansonService.getChansonsByAlbum(albumId, pageable));
    }

    // Admin endpoints
    @PostMapping("/api/admin/songs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChansonDTO> createChanson(@RequestBody ChansonDTO chansonDTO) {
        return ResponseEntity.ok(chansonService.createChanson(chansonDTO));
    }

    @PutMapping("/api/admin/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChansonDTO> updateChanson(
            @PathVariable String id,
            @RequestBody ChansonDTO chansonDTO) {
        return ResponseEntity.ok(chansonService.updateChanson(id, chansonDTO));
    }

    @DeleteMapping("/api/admin/songs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteChanson(@PathVariable String id) {
        chansonService.deleteChanson(id);
        return ResponseEntity.ok().build();
    }
}
