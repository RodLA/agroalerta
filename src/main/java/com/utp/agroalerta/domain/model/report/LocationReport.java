package com.utp.agroalerta.domain.model.report;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationReport {
    private Integer id;
    private String risk;
    private Integer count;
}
