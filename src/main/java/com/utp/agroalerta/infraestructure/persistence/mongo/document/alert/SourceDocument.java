package com.utp.agroalerta.infraestructure.persistence.mongo.document.alert;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SourceDocument {
    private String document;
    private String title;
    private String url;
    @Field("discovered_at")
    private LocalDateTime discoveredAt;
    private String site;
    @Field("site_name")
    private String siteName;
}
