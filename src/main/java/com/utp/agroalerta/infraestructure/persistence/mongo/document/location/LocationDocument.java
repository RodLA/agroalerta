package com.utp.agroalerta.infraestructure.persistence.mongo.document.location;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@Document(collection = "locations")
public class LocationDocument {
    @Id
    private String id;
    @Field("parent_id")
    private String parentId;
    private Integer ubigeo;
    private String name;
    private String type;
    @Field("meta_info")
    private MetaInfoDocument metaInfo;
    @Field("is_active")
    private Boolean isActive;
}
