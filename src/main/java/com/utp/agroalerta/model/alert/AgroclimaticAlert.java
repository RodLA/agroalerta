package com.utp.agroalerta.model.alert;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Document(collection = "agroclimatic_alerts")
public class AgroclimaticAlert {

    @Id
    private String id;
    @Field("source_document")
    private SourceDocument sourceDocument;
    @Field("risk_level")
    private String riskLevel;
    @Field("event_type")
    private EventType eventType;
    private String title;
    private String summary;
    @Field("detailed_info")
    private String detailedInfo;
    private List<Integer> departments;
    private List<Integer> provinces;
    private List<String> crops;
    @Field("affected_areas")
    private List<AffectedArea> affectedAreas;
    @Field("vulnerable_crops")
    private List<VulnerableCrop> vulnerableCrops;
    private List<String> recommendations;
    @Field("publication_at")
    private LocalDateTime publicationAt;
}
