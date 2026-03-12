package com.utp.agroalerta.application.services;

import com.utp.agroalerta.domain.model.location.Location;
import com.utp.agroalerta.domain.ports.in.RetrieveLocationsUseCase;
import com.utp.agroalerta.domain.ports.out.LocationRepositoryPort;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class LocationService implements RetrieveLocationsUseCase {

    private final LocationRepositoryPort locationRepositoryPort;

    @Override
    public List<Location> findAllByType(String type) {
        return locationRepositoryPort.findAllByType(type);
    }

    @Override
    public List<Location> findAllByParentId(String parentId) {
        return locationRepositoryPort.findAllByParentId(parentId);
    }
}
