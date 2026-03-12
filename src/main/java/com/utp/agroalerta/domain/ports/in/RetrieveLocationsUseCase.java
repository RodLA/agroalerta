package com.utp.agroalerta.domain.ports.in;

import com.utp.agroalerta.domain.model.location.Location;

import java.util.List;

public interface RetrieveLocationsUseCase {
    List<Location> findAllByType(String type);
    List<Location> findAllByParentId(String parentId);
}
