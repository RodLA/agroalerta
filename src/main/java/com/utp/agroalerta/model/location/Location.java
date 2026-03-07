package com.utp.agroalerta.model.location;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Document(collection = "locations")
public class Location {
    @Id
    private String id;
    @Field("parent_id")
    private String parentId;
    private Integer ubigeo;
    private String name;
    private String type;
    @Field("meta_info")
    private MetaInfo metaInfo;
    @Field("is_active")
    private Boolean isActive;

}
