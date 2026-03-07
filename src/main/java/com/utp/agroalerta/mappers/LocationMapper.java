package com.utp.agroalerta.mappers;

import com.utp.agroalerta.dto.DepartmentDto;
import com.utp.agroalerta.dto.ProvinceDto;
import com.utp.agroalerta.model.location.Location;

public class LocationMapper {

    public static DepartmentDto toDepartmentDto(Location location) {
        return DepartmentDto.builder()
                .id(location.getId())
                .ubigeo(location.getUbigeo())
                .name(location.getName())
                .metaInfo(location.getMetaInfo())
                .build();
    }

    public static ProvinceDto toProvinceDto(Location location) {
        return ProvinceDto.builder()
                .ubigeo(location.getUbigeo())
                .parentId(location.getParentId())
                .name(location.getName())
                .build();
    }

}
