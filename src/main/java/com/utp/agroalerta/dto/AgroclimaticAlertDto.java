package com.utp.agroalerta.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class AgroclimaticAlertDto {
    private String id;
    private EventDto eventType;
    private String riskLevel;
    private String title;
    private String summary;
    private List<CropDto> crops;
    private List<String> areas;
    private SourceDto source;
    private LocalDateTime publicationAt;
}