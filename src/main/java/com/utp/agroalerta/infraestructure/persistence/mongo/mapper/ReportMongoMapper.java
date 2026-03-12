package com.utp.agroalerta.infraestructure.persistence.mongo.mapper;

import com.utp.agroalerta.domain.model.alert.Crop;
import com.utp.agroalerta.domain.model.report.LocationReport;
import com.utp.agroalerta.domain.model.report.Report;
import com.utp.agroalerta.domain.model.report.Site;
import com.utp.agroalerta.infraestructure.persistence.mongo.document.alert.CropDocument;
import com.utp.agroalerta.infraestructure.persistence.mongo.view.LocationReportView;
import com.utp.agroalerta.infraestructure.persistence.mongo.view.ReportView;
import com.utp.agroalerta.infraestructure.persistence.mongo.view.SiteView;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ReportMongoMapper {

    public Report toDomain(ReportView report) {
        return Report.builder()
                .crops(report.getCrops().stream().map(this::toDomain).toList())
                .sources(report.getSources().stream().map(this::toDomain).toList())
                .levels(report.getLevels())
                .locations(report.getLocations().entrySet().stream()
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                entry -> entry.getValue().stream().map(this::toDomain).toList()
                        ))
                ).build();
    }

    public Crop toDomain(CropDocument crop) {
        return Crop.builder()
                .id(crop.getId())
                .name(crop.getName())
                .build();
    }

    public Site toDomain(SiteView site) {
        return Site.builder()
                .site(site.getSite())
                .siteName(site.getSiteName())
                .build();
    }

    public LocationReport toDomain(LocationReportView location) {
        return LocationReport.builder()
                .id(location.getId())
                .risk(location.getRisk())
                .count(location.getCount())
                .build();
    }

}
