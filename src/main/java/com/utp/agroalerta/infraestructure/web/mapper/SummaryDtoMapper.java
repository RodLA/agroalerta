package com.utp.agroalerta.infraestructure.web.mapper;

import com.utp.agroalerta.domain.model.report.Summary;
import com.utp.agroalerta.infraestructure.web.dto.report.SummaryDto;
import org.springframework.stereotype.Component;

@Component
public class SummaryDtoMapper {

    public SummaryDto toDto(Summary summary) {
        return SummaryDto.builder()
                .lastUpdate(summary.getLastUpdate())
                .totalAlerts(summary.getTotalAlerts())
                .totalCritical(summary.getTotalCritical())
                .totalDepts(summary.getTotalDepts())
                .build();
    }

}
