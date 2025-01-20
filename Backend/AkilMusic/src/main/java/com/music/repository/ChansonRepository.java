package com.music.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.music.model.Chanson;

public interface ChansonRepository extends MongoRepository<Chanson, String> {
    Page<Chanson> findByTitreContainingIgnoreCase(String titre, Pageable pageable);
    Page<Chanson> findByAlbumId(String albumId, Pageable pageable);
}
