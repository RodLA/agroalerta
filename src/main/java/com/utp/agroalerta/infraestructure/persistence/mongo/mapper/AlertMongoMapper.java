package com.utp.agroalerta.infraestructure.persistence.mongo.mapper;

import com.utp.agroalerta.domain.model.alert.*;
import com.utp.agroalerta.infraestructure.persistence.mongo.document.alert.*;
import com.utp.agroalerta.infraestructure.persistence.mongo.projection.AlertProjection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AlertMongoMapper {

    private final RecommendationMongoMapper recommendationMongoMapper;

    public AlertDocument toDocument(Alert alert) {
        return AlertDocument.builder()
                .id(alert.getId())
                .pdfKey(alert.getPdfKey())
                .source(this.toDocument(alert.getSource()))
                .processedAt(alert.getProcessedAt())
                .riskDate(alert.getRiskDate())
                .crops(alert.getCrops().stream().map(this::toDocument).toList())
                .risk(alert.getRisk().getLabel())
                .event(this.toDocument(alert.getEvent()))
                .departmentIds(alert.getDepartmentIds())
                .provinceIds(alert.getProvinceIds())
                .departments(alert.getDepartments().stream().map(this::toDocument).toList())
                .title(alert.getTitle())
                .description(alert.getDescription())
                .summary(alert.getSummary())
                .build();
    }

    public Alert toDomain(AlertDocument alert) {
        return Alert.builder()
                .id(alert.getId())
                .pdfKey(alert.getPdfKey())
                .source(this.toDomain(alert.getSource()))
                .processedAt(alert.getProcessedAt())
                .riskDate(alert.getRiskDate())
                .crops(alert.getCrops().stream().map(this::toDomain).toList())
                .risk(RiskLevel.fromLabel(alert.getRisk()))
                .event(this.toDomain(alert.getEvent()))
                .departmentIds(alert.getDepartmentIds())
                .provinceIds(alert.getProvinceIds())
                .departments(alert.getDepartments().stream().map(this::toDomain).toList())
                .title(alert.getTitle())
                .description(alert.getDescription())
                .summary(alert.getSummary())
                .recommendations(alert.getRecommendations().stream().map(recommendationMongoMapper::toDomain).toList())
                .build();
    }

    public AlertInfo toDomain(AlertProjection alert) {
        return AlertInfo.builder()
                .id(alert.getId())
                .event(this.toDomain(alert.getEvent()))
                .risk(RiskLevel.fromLabel(alert.getRisk()))
                .title(alert.getTitle())
                .summary(alert.getSummary())
                .crops(alert.getCrops().stream().map(this::toDomain).toList())
                .departments(alert.getDepartments().stream().map(AlertProjection.Department::getName).toList())
                .source(alert.getSource().getSite())
                .riskDate(alert.getRiskDate())
                .build();
    }

    public SourceDocument toDocument(Source source) {
        return SourceDocument.builder()
                .document(source.getDocument())
                .title(source.getTitle())
                .url(source.getUrl())
                .discoveredAt(source.getDiscoveredAt())
                .site(source.getSite())
                .siteName(source.getSiteName())
                .build();
    }

    public Source toDomain(SourceDocument source) {
        return Source.builder()
                .document(source.getDocument())
                .title(source.getTitle())
                .url(source.getUrl())
                .discoveredAt(source.getDiscoveredAt())
                .site(source.getSite())
                .siteName(source.getSiteName())
                .build();
    }

    public CropDocument toDocument(Crop crop) {
        return CropDocument.builder()
                .id(crop.getId())
                .name(crop.getName())
                .build();
    }

    public Crop toDomain(CropDocument crop) {
        return Crop.builder()
                .id(crop.getId())
                .name(crop.getName())
                .build();
    }

    public Crop toDomain(AlertProjection.Crop crop) {
        return Crop.builder()
                .id(crop.getId())
                .name(crop.getName())
                .build();
    }

    public EventDocument toDocument(Event event) {
        return EventDocument.builder()
                .id(event.getId())
                .name(event.getName())
                .build();
    }

    public Event toDomain(EventDocument event) {
        return Event.builder()
                .id(event.getId())
                .name(event.getName())
                .build();
    }

    public Event toDomain(AlertProjection.Event event) {
        return Event.builder()
                .id(event.getId())
                .name(event.getName())
                .build();
    }

    public DepartmentDocument toDocument(Department department) {
        return DepartmentDocument.builder()
                .id(department.getId())
                .name(department.getName())
                .provinces(department.getProvinces().stream().map(this::toDocument).toList())
                .build();
    }

    public Department toDomain(DepartmentDocument department) {
        return Department.builder()
                .id(department.getId())
                .name(department.getName())
                .provinces(department.getProvinces().stream().map(this::toDomain).toList())
                .build();
    }

    public ProvinceDocument toDocument(Province province) {
        return ProvinceDocument.builder()
                .id(province.getId())
                .name(province.getName())
                .build();
    }

    public Province toDomain(ProvinceDocument province) {
        return Province.builder()
                .id(province.getId())
                .name(province.getName())
                .build();
    }

}
