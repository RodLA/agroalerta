package com.utp.agroalerta.infraestructure.web.dto.alert;

import lombok.*;

import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class DepartmentDto {
    private Long id;
    private String name;
    private List<ProvinceDto> provinces;
}
