package com.utp.agroalerta.infraestructure.persistence.mongo.view;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SiteView {
    private String site;
    @Field("site_name")
    private String siteName;
}
