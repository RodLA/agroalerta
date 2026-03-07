package com.utp.agroalerta.mappers;

import com.utp.agroalerta.dto.AgroclimaticAlertDto;
import com.utp.agroalerta.dto.CropDto;
import com.utp.agroalerta.dto.EventDto;
import com.utp.agroalerta.dto.SourceDto;
import com.utp.agroalerta.model.alert.AffectedArea;
import com.utp.agroalerta.model.alert.AgroclimaticAlert;

public class AgroclimaticAlertMapper {

    private AgroclimaticAlertMapper() {
    }

    public static AgroclimaticAlertDto toDto(AgroclimaticAlert alert) {
        return AgroclimaticAlertDto.builder()
                .id(alert.getId())
                .eventType(EventDto.builder()
                        .id(alert.getEventType().getEventId())
                        .name(alert.getEventType().getEventName())
                        .build()
                ).riskLevel(alert.getRiskLevel())
                .title(alert.getTitle())
                .summary(alert.getSummary())
                .crops(alert.getVulnerableCrops().stream().map(crop -> CropDto.builder()
                                .id(crop.getCropId())
                                .name(crop.getCropName())
                                .build()
                        ).toList()
                ).areas(alert.getAffectedAreas().stream().map(AffectedArea::getDepartmentName).toList())
                .source(SourceDto.builder()
                        .id(alert.getSourceDocument().getOfficialSource().getSourceId())
                        .name(alert.getSourceDocument().getOfficialSource().getSourceName())
                        .build()
                ).publicationAt(alert.getPublicationAt())
                .build();
    }

}
