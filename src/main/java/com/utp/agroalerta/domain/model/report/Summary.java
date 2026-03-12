package com.utp.agroalerta.domain.model.report;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Summary {
    private LocalDateTime lastUpdate;
    private Integer totalAlerts;
    private Integer totalCritical;
    private Integer totalDepts;
}
