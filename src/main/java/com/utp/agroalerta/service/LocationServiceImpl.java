package com.utp.agroalerta.service;

import com.utp.agroalerta.dto.DepartmentDto;
import com.utp.agroalerta.dto.ProvinceDto;
import com.utp.agroalerta.mappers.LocationMapper;
import com.utp.agroalerta.model.location.Location;
import com.utp.agroalerta.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository repository;

    private static final String TYPE_DEPARTMENT = "DEPARTAMENTO";


    @Override
    public List<DepartmentDto> getDepartments() {
        log.info("[Service] Iniciando la obtención de departamentos.");
        List<Location> locations = repository.findAllByType(TYPE_DEPARTMENT);

        return locations.stream().map(LocationMapper::toDepartmentDto).toList();
    }

    @Override
    public List<ProvinceDto> getProvinces(String id) {
        log.info("[Service] Iniciando la obtención de provincias.");
        List<Location> locations = repository.findAllByParentId((id));

        return locations.stream().map(LocationMapper::toProvinceDto).toList();
    }
}
