package com.utp.agroalerta.domain.model.alert;

import lombok.*;

import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class AlertInfo {
    private String id;
    private Event event;
    private RiskLevel risk;
    private String title;
    private String summary;
    private List<Crop> crops;
    private List<String> departments;
    private String source;
    private String riskDate;
}
