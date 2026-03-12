package com.utp.agroalerta.infraestructure.persistence.mongo.view;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationReportView {
    @Field("id")
    private Integer id;
    private String risk;
    private Integer count;
}
