package com.utp.agroalerta.service;

import com.utp.agroalerta.dto.DepartmentDto;
import com.utp.agroalerta.dto.ProvinceDto;

import java.util.List;

public interface LocationService {
    List<DepartmentDto> getDepartments();

    List<ProvinceDto> getProvinces(String id);
}
