package com.utp.agroalerta.infraestructure.web.mapper;

import com.utp.agroalerta.domain.model.location.Location;
import com.utp.agroalerta.domain.model.location.MetaInfo;
import com.utp.agroalerta.infraestructure.web.dto.location.LocationDto;
import com.utp.agroalerta.infraestructure.web.dto.location.MetaInfoDto;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class LocationDtoMapper {

    public LocationDto toDto(Location location) {
        return LocationDto.builder()
                .id(location.getId())
                .name(location.getName())
                .ubigeo(location.getUbigeo())
                .metaInfo(this.toDto(location.getMetaInfo()))
                .build();
    }

    public MetaInfoDto toDto(MetaInfo metaInfo) {
        if (Objects.isNull(metaInfo)) return null;
        return MetaInfoDto.builder()
                .latitude(metaInfo.getLatitude())
                .longitude(metaInfo.getLongitude())
                .zoom(metaInfo.getZoom())
                .build();
    }

}
