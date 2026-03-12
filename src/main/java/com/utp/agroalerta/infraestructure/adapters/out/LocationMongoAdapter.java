package com.utp.agroalerta.infraestructure.adapters.out;

import com.utp.agroalerta.domain.model.location.Location;
import com.utp.agroalerta.domain.ports.out.LocationRepositoryPort;
import com.utp.agroalerta.infraestructure.persistence.mongo.document.location.LocationDocument;
import com.utp.agroalerta.infraestructure.persistence.mongo.mapper.LocationMongoMapper;
import com.utp.agroalerta.infraestructure.persistence.mongo.repository.LocationMongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
public class LocationMongoAdapter implements LocationRepositoryPort {

    private final LocationMongoRepository locationMongoRepository;
    private final LocationMongoMapper locationMongoMapper;

    @Override
    public List<Location> findAllByType(String type) {
        return locationMongoRepository.findAllByType(type).stream()
                .sorted(Comparator.comparing(LocationDocument::getUbigeo))
                .map(locationMongoMapper::toDomain).toList();
    }

    @Override
    public List<Location> findAllByParentId(String parentId) {
        return locationMongoRepository.findAllByParentId(parentId).stream()
                .sorted(Comparator.comparing(LocationDocument::getUbigeo))
                .map(locationMongoMapper::toDomain).toList();
    }

}
