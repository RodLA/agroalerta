package com.utp.agroalerta.infraestructure.persistence.mongo.document.alert;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class DepartmentDocument {
    @Field("id")
    private Long id;
    private String name;
    private List<ProvinceDocument> provinces;
}
