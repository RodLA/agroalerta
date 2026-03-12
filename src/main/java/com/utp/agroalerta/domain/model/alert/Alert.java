package com.utp.agroalerta.domain.model.alert;

import com.utp.agroalerta.domain.model.reco.Recommendation;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Alert {
    private String id;
    private String pdfKey;
    private Source source;
    private LocalDateTime processedAt;
    private String riskDate;
    private List<Crop> crops;
    private RiskLevel risk;
    private Event event;
    private List<Integer> departmentIds;
    private List<Integer> provinceIds;
    private List<Department> departments;
    private String title;
    private String description;
    private String summary;
    private List<Recommendation> recommendations;
}
