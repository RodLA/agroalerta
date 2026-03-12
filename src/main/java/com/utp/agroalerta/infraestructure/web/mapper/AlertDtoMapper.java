package com.utp.agroalerta.infraestructure.web.mapper;

import com.utp.agroalerta.domain.model.alert.*;
import com.utp.agroalerta.infraestructure.web.dto.alert.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AlertDtoMapper {

    private final RecommendationDtoMapper recommendationDtoMapper;

    public AlertDto toDto(Alert alert) {
        return AlertDto.builder()
                .id(alert.getId())
                .pdfKey(alert.getPdfKey())
                .source(this.toDto(alert.getSource()))
                .processedAt(alert.getProcessedAt())
                .riskDate(alert.getRiskDate())
                .crops(alert.getCrops().stream().map(this::toDto).toList())
                .risk(alert.getRisk())
                .event(this.toDto(alert.getEvent()))
                .departmentIds(alert.getDepartmentIds())
                .provinceIds(alert.getProvinceIds())
                .departments(alert.getDepartments().stream().map(this::toDto).toList())
                .title(alert.getTitle())
                .description(alert.getDescription())
                .summary(alert.getSummary())
                .recommendations(alert.getRecommendations().stream().map(recommendationDtoMapper::toDto).toList())
                .build();
    }

    public AlertInfoDto toDto(AlertInfo alert) {
        return AlertInfoDto.builder()
                .id(alert.getId())
                .event(this.toDto(alert.getEvent()))
                .risk(alert.getRisk())
                .title(alert.getTitle())
                .summary(alert.getSummary())
                .crops(alert.getCrops().stream().map(this::toDto).toList())
                .departments(alert.getDepartments())
                .source(alert.getSource())
                .riskDate(alert.getRiskDate())
                .build();
    }

    public Alert toDomain(AlertDto alert) {
        return Alert.builder()
                .id(alert.getId())
                .pdfKey(alert.getPdfKey())
                .source(this.toDomain(alert.getSource()))
                .processedAt(alert.getProcessedAt())
                .riskDate(alert.getRiskDate())
                .crops(alert.getCrops().stream().map(this::toDomain).toList())
                .risk(alert.getRisk())
                .event(this.toDomain(alert.getEvent()))
                .departmentIds(alert.getDepartmentIds())
                .provinceIds(alert.getProvinceIds())
                .departments(alert.getDepartments().stream().map(this::toDomain).toList())
                .title(alert.getTitle())
                .description(alert.getDescription())
                .summary(alert.getSummary())
                .recommendations(alert.getRecommendations().stream().map(recommendationDtoMapper::toDomain).toList())
                .build();
    }

    public SourceDto toDto(Source source) {
        return SourceDto.builder()
                .document(source.getDocument())
                .title(source.getTitle())
                .url(source.getUrl())
                .discoveredAt(source.getDiscoveredAt())
                .site(source.getSite())
                .siteName(source.getSiteName())
                .build();
    }

    public Source toDomain(SourceDto source) {
        return Source.builder()
                .document(source.getDocument())
                .title(source.getTitle())
                .url(source.getUrl())
                .discoveredAt(source.getDiscoveredAt())
                .site(source.getSite())
                .siteName(source.getSiteName())
                .build();
    }

    public CropDto toDto(Crop crop) {
        return CropDto.builder()
                .id(crop.getId())
                .name(crop.getName())
                .build();
    }

    public Crop toDomain(CropDto crop) {
        return Crop.builder()
                .id(crop.getId())
                .name(crop.getName())
                .build();
    }

    public EventDto toDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .name(event.getName())
                .build();
    }

    public Event toDomain(EventDto event) {
        return Event.builder()
                .id(event.getId())
                .name(event.getName())
                .build();
    }

    public DepartmentDto toDto(Department department) {
        return DepartmentDto.builder()
                .id(department.getId())
                .name(department.getName())
                .provinces(department.getProvinces().stream().map(this::toDto).toList())
                .build();
    }

    public Department toDomain(DepartmentDto department) {
        return Department.builder()
                .id(department.getId())
                .name(department.getName())
                .provinces(department.getProvinces().stream().map(this::toDomain).toList())
                .build();
    }

    public ProvinceDto toDto(Province province) {
        return ProvinceDto.builder()
                .id(province.getId())
                .name(province.getName())
                .build();
    }

    public Province toDomain(ProvinceDto province) {
        return Province.builder()
                .id(province.getId())
                .name(province.getName())
                .build();
    }

}
