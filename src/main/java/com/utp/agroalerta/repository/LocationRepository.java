package com.utp.agroalerta.repository;

import com.utp.agroalerta.model.location.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {
    List<Location> findAllByType(String type);

    List<Location> findAllByParentId(String parentId);
}
