package com.utp.agroalerta.infraestructure.persistence.mongo.view;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SummaryView {
    @Field("last_update")
    private LocalDateTime lastUpdate;
    @Field("total_alerts")
    private Integer totalAlerts;
    @Field("total_critical")
    private Integer totalCritical;
    @Field("total_depts")
    private Integer totalDepts;
}
