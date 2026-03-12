package com.utp.agroalerta.domain.ports.out;

import com.utp.agroalerta.domain.model.location.Location;

import java.util.List;

public interface LocationRepositoryPort {
    List<Location> findAllByType(String type);
    List<Location> findAllByParentId(String parentId);
}
