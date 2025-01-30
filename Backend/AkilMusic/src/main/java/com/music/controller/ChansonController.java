package com.music.controller;

import com.music.dto.ChansonDTO;
import com.music.service.interfaces.ChansonService;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

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

    @GetMapping("/api/user/songs/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ChansonDTO> getChansonById(@PathVariable String id) {
        return ResponseEntity.ok(chansonService.getChansonById(id));
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
    @PostMapping(value =  "/api/admin/songs" ,  consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChansonDTO> createChanson(
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("audioFile") MultipartFile audioFile,
            @RequestParam("albumId") String albumId) throws IOException {

        ChansonDTO chansonDTO = new ChansonDTO();
        chansonDTO.setTitre(titre);
        chansonDTO.setDescription(description);
        chansonDTO.setCategory(category);
        chansonDTO.setDate(date);
        chansonDTO.setAlbumId(albumId);

        ChansonDTO createdChanson = chansonService.createChanson(chansonDTO, audioFile);
        return ResponseEntity.ok(createdChanson);
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
