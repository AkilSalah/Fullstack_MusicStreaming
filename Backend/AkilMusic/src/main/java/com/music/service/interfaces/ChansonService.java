package com.music.service.interfaces;

import com.music.dto.ChansonDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChansonService {
    Page<ChansonDTO> getAllChansons(Pageable pageable);
    Page<ChansonDTO> searchChansonsByTitle(String titre, Pageable pageable);
    Page<ChansonDTO> getChansonsByAlbum(String albumId, Pageable pageable);
    ChansonDTO getChansonById(String id);
    ChansonDTO createChanson(ChansonDTO chansonDTO);
    ChansonDTO updateChanson(String id, ChansonDTO chansonDTO);
    void deleteChanson(String id);
}
