package com.utp.agroalerta.infraestructure.web.dto.report;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationReportDto {
    private Integer id;
    private String risk;
    private Integer count;
}
