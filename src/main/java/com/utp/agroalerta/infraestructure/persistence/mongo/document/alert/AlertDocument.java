package com.utp.agroalerta.infraestructure.persistence.mongo.document.alert;

import com.utp.agroalerta.infraestructure.persistence.mongo.document.reco.RecommendationDocument;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@Document(collection = "documents_risk_alerts")
public class AlertDocument {
    @Id
    private String id;
    @Field("pdf_key")
    private String pdfKey;
    private SourceDocument source;
    @Field("processed_at")
    private LocalDateTime processedAt;
    @Field("risk_date")
    private String riskDate;
    private List<CropDocument> crops;
    private String risk;
    private EventDocument event;
    @Field("department_ids")
    private List<Integer> departmentIds;
    @Field("province_ids")
    private List<Integer> provinceIds;
    private List<DepartmentDocument> departments;
    private String title;
    private String description;
    private String summary;

    @ReadOnlyProperty
    @DocumentReference(lookup = "{'pdf_key': ?#{#self.pdf_key}}", lazy = true)
    private List<RecommendationDocument> recommendations;
}
