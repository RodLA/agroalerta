package com.utp.agroalerta.infraestructure.web.mapper;

import com.utp.agroalerta.domain.model.alert.Crop;
import com.utp.agroalerta.domain.model.report.LocationReport;
import com.utp.agroalerta.domain.model.report.Report;
import com.utp.agroalerta.domain.model.report.Site;
import com.utp.agroalerta.infraestructure.web.dto.alert.CropDto;
import com.utp.agroalerta.infraestructure.web.dto.report.LocationReportDto;
import com.utp.agroalerta.infraestructure.web.dto.report.ReportDto;
import com.utp.agroalerta.infraestructure.web.dto.report.SiteDto;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ReportDtoMapper {

    public ReportDto toDto(Report report) {
        return ReportDto.builder()
                .crops(report.getCrops().stream().map(this::toDto).toList())
                .sources(report.getSources().stream().map(this::toDto).toList())
                .levels(report.getLevels())
                .locations(report.getLocations().entrySet().stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> entry.getValue().stream().map(this::toDto).toList()
                        ))
                ).build();
    }

    public CropDto toDto(Crop crop) {
        return CropDto.builder()
                .id(crop.getId())
                .name(crop.getName())
                .build();
    }

    public SiteDto toDto(Site site) {
        return SiteDto.builder()
                .site(site.getSite())
                .siteName(site.getSiteName())
                .build();
    }

    public LocationReportDto toDto(LocationReport location) {
        return LocationReportDto.builder()
                .id(location.getId())
                .risk(location.getRisk())
                .count(location.getCount())
                .build();
    }

}
