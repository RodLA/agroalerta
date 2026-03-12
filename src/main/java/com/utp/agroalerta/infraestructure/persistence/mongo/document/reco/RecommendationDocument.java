package com.utp.agroalerta.infraestructure.persistence.mongo.document.reco;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@Document(collection = "alerts_recommendations")
@CompoundIndex(def = "{'pdf_key': 1}")
public class RecommendationDocument {
    @Id
    private String id;
    @Field("pdf_key")
    private String pdfKey;
    private String domain;
    @Field("colloquial_recommendation")
    private String reco;
    @Field("processed_at")
    private LocalDateTime processedAt;
}
