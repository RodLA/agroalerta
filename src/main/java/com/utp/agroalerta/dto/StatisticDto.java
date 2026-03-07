package com.utp.agroalerta.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class GlobalStatisticDto {

    private Integer totalAlerts;
    private Integer criticalAlerts;
    private Integer affectedDepartments;
    private LocalDateTime lastUpdate;

}
