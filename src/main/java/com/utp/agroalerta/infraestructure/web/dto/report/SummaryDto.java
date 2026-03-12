package com.utp.agroalerta.infraestructure.web.dto.report;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SummaryDto {
    private LocalDateTime lastUpdate;
    private Integer totalAlerts;
    private Integer totalCritical;
    private Integer totalDepts;
}
