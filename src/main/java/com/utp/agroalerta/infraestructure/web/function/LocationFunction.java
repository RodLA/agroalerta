package com.utp.agroalerta.infraestructure.web.function;

import com.utp.agroalerta.domain.model.location.Location;
import com.utp.agroalerta.domain.ports.in.RetrieveLocationsUseCase;
import com.utp.agroalerta.infraestructure.adapters.in.CloudResponse;
import com.utp.agroalerta.infraestructure.web.dto.location.LocationDto;
import com.utp.agroalerta.infraestructure.web.mapper.LocationDtoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class LocationFunction {

    private final RetrieveLocationsUseCase retrieveLocationsUseCase;
    private final LocationDtoMapper locationDtoMapper;

    static final String TYPE_DEPARTMENT = "DEPARTAMENTO";

    @Bean(name = "getDepartments")
    public Supplier<CloudResponse<List<LocationDto>>> getDepartments() {
        return () -> {
            log.info("[API] getDepartments - START");
            List<Location> locations = retrieveLocationsUseCase.findAllByType(TYPE_DEPARTMENT);
            log.info("[API] getDepartments - END");
            return CloudResponse.success(locations.stream().map(locationDtoMapper::toDto).toList(), "OK");
        };
    }

    @Bean(name = "getProvinces")
    public Function<String, CloudResponse<List<LocationDto>>> getProvinces() {
        return parentId -> {
            log.info("[API] getProvinces - START");
            List<Location> locations = retrieveLocationsUseCase.findAllByParentId(parentId);
            log.info("[API] getProvinces - END");
            return CloudResponse.success(locations.stream().map(locationDtoMapper::toDto).toList(), "OK");
        };
    }

}
