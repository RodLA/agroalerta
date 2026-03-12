package com.utp.agroalerta.infraestructure.persistence.mongo.document.alert;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ProvinceDocument {
    @Field("id")
    private Long id;
    private String name;
}
