package com.utp.agroalerta.infraestructure.persistence.mongo.repository;

import com.utp.agroalerta.infraestructure.persistence.mongo.document.location.LocationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LocationMongoRepository extends MongoRepository<LocationDocument, String> {
    List<LocationDocument> findAllByType(String type);
    List<LocationDocument> findAllByParentId(String parentId);
}
