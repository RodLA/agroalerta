package com.utp.agroalerta.mappers;

import com.utp.agroalerta.dto.AgroclimaticAlertDetailDto;
import com.utp.agroalerta.model.AgroclimaticAlert;

public class AgroclimaticAlertMapper {

    public static AgroclimaticAlertDetailDto toDetailDto(AgroclimaticAlert model) {
        if (model == null) return null;
        return AgroclimaticAlertDetailDto.builder()
                .id(model.getId())
                .sourceDocument(model.getSourceDocument())
                .riskLevel(model.getRiskLevel())
                .eventType(model.getEventType())
                .title(model.getTitle())
                .summary(model.getSummary())
                .detailedInfo(model.getDetailedInfo())
                .affectedAreas(model.getAffectedAreas())
                .vulnerableCrops(model.getVulnerableCrops())
                .recommendations(model.getRecommendations())
                .publicationAt(model.getPublicationAt())
                .build();
    }
}
