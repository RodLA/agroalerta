package com.utp.agroalerta.infraestructure.web.dto.alert;

import com.utp.agroalerta.domain.model.alert.RiskLevel;
import com.utp.agroalerta.infraestructure.web.dto.reco.RecommendationDto;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class AlertDto {
    private String id;
    private String pdfKey;
    private SourceDto source;
    private LocalDateTime processedAt;
    private String riskDate;
    private List<CropDto> crops;
    private RiskLevel risk;
    private EventDto event;
    private List<Integer> departmentIds;
    private List<Integer> provinceIds;
    private List<DepartmentDto> departments;
    private String title;
    private String description;
    private String summary;
    private List<RecommendationDto> recommendations;
}
