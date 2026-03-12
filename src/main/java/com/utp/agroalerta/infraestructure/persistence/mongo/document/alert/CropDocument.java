package com.utp.agroalerta.infraestructure.persistence.mongo.document.alert;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class CropDocument {
    @Field("id")
    private String id;
    private String name;
}
