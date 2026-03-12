package com.utp.agroalerta.infraestructure.web.dto.report;

import com.utp.agroalerta.infraestructure.web.dto.alert.CropDto;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ReportDto {
    private List<CropDto> crops;
    private List<SiteDto> sources;
    private List<String> levels;
    private Map<String, List<LocationReportDto>> locations;
}
