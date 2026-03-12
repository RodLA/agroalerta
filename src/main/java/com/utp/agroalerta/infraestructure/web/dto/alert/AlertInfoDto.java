package com.utp.agroalerta.infraestructure.web.dto.alert;

import com.utp.agroalerta.domain.model.alert.RiskLevel;
import lombok.*;

import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class AlertInfoDto {
    private String id;
    private EventDto event;
    private RiskLevel risk;
    private String title;
    private String summary;
    private List<CropDto> crops;
    private List<String> departments;
    private String source;
    private String riskDate;
}
