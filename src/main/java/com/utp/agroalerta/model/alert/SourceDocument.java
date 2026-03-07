package com.utp.agroalerta.model.alert;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class SourceDocument {

    @Field("document_id")
    private String documentId;
    @Field("document_title")
    private String documentTitle;
    @Field("document_url")
    private String documentUrl;
    @Field("discovered_at")
    private LocalDateTime discoveredAt;
    @Field("published_at")
    private LocalDate publishedAt;
    @Field("official_source")
    private OfficialSource officialSource;
}
