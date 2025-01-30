package com.music.service.implementation;

import com.music.dto.ChansonDTO;
import com.music.repository.AlbumRepository;
import com.music.repository.ChansonRepository;
import com.music.service.interfaces.ChansonService;
import com.music.mapper.ChansonMapper;
import com.music.model.Album;
import com.music.model.Chanson;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ChansonServiceImpl implements ChansonService {

    private final ChansonRepository chansonRepository;
    private final ChansonMapper chansonMapper;
    private final AlbumRepository albumRepository;

    @Value("${upload.directory}") 
    private String uploadDirectory;

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
    public ChansonDTO createChanson(ChansonDTO chansonDTO, MultipartFile audioFile) throws IOException {
        Album album = albumRepository.findById(chansonDTO.getAlbumId())
            .orElseThrow(() -> new RuntimeException("Album not found"));

        String audioFilePath = saveAudioFile(audioFile);

        Chanson chanson = chansonMapper.toEntity(chansonDTO);
        chanson.setAlbum(album);
        chanson.setAudioFile(audioFilePath); 
        Chanson savedChanson = chansonRepository.save(chanson);

        ChansonDTO responseDTO = chansonMapper.toDto(savedChanson);
        responseDTO.setAlbumId(album.getId());
        responseDTO.setAudioFile(audioFilePath); 
        return responseDTO;
    }

    private String saveAudioFile(MultipartFile audioFile) throws IOException {
        if (audioFile.isEmpty()) {
            throw new RuntimeException("Le fichier audio est vide.");
        }

        String fileName = UUID.randomUUID().toString() + "_" + audioFile.getOriginalFilename();
        Path filePath = Paths.get(uploadDirectory, fileName);

        Files.copy(audioFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
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
