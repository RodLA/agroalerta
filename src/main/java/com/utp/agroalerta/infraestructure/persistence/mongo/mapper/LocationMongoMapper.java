package com.utp.agroalerta.infraestructure.persistence.mongo.mapper;

import com.utp.agroalerta.domain.model.location.Location;
import com.utp.agroalerta.domain.model.location.MetaInfo;
import com.utp.agroalerta.infraestructure.persistence.mongo.document.location.LocationDocument;
import com.utp.agroalerta.infraestructure.persistence.mongo.document.location.MetaInfoDocument;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class LocationMongoMapper {

    public LocationDocument toDocument(Location location) {
        return LocationDocument.builder()
                .id(location.getId())
                .parentId(location.getParentId())
                .ubigeo(location.getUbigeo())
                .name(location.getName())
                .type(location.getType())
                .metaInfo(this.toDocument(location.getMetaInfo()))
                .isActive(location.getIsActive())
                .build();
    }

    public Location toDomain(LocationDocument location) {
        return Location.builder()
                .id(location.getId())
                .parentId(location.getParentId())
                .ubigeo(location.getUbigeo())
                .name(location.getName())
                .type(location.getType())
                .metaInfo(this.toDomain(location.getMetaInfo()))
                .isActive(location.getIsActive())
                .build();
    }

    public MetaInfoDocument toDocument(MetaInfo metaInfo) {
        return MetaInfoDocument.builder()
                .latitude(metaInfo.getLatitude())
                .longitude(metaInfo.getLongitude())
                .zoom(metaInfo.getZoom())
                .build();
    }

    public MetaInfo toDomain(MetaInfoDocument metaInfo) {
        if (Objects.isNull(metaInfo)) return null;
        return MetaInfo.builder()
                .latitude(metaInfo.getLatitude())
                .longitude(metaInfo.getLongitude())
                .zoom(metaInfo.getZoom())
                .build();
    }

}
