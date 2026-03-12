package com.utp.agroalerta.infraestructure.persistence.mongo.mapper;

import com.utp.agroalerta.domain.model.report.Summary;
import com.utp.agroalerta.infraestructure.persistence.mongo.view.SummaryView;
import org.springframework.stereotype.Component;

@Component
public class SummaryMongoMapper {

    public Summary toDomain(SummaryView summary) {
        return Summary.builder()
                .lastUpdate(summary.getLastUpdate())
                .totalAlerts(summary.getTotalAlerts())
                .totalCritical(summary.getTotalCritical())
                .totalDepts(summary.getTotalDepts())
                .build();
    }

}
