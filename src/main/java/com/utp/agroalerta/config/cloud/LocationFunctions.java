package com.utp.agroalerta.config.cloud;

import com.utp.agroalerta.config.response.CloudResponse;
import com.utp.agroalerta.dto.DepartmentDto;
import com.utp.agroalerta.dto.ProvinceDto;
import com.utp.agroalerta.service.LocationService;
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
public class LocationFunctions {

    private final LocationService service;

    @Bean(name = "departments")
    public Supplier<CloudResponse<List<DepartmentDto>>> getDepartments() {
        return () -> {
            log.info("[API] getDepartments - START");
            List<DepartmentDto> data = service.getDepartments();

            return CloudResponse.success(data, "OK");
        };
    }

    @Bean(name = "provinces")
    public Function<String, CloudResponse<List<ProvinceDto>>> getProvinces() {
        return id -> {
            log.info("[API] getProvinces - START");
            List<ProvinceDto> data = service.getProvinces(id);

            return CloudResponse.success(data, "OK");
        };
    }

}
