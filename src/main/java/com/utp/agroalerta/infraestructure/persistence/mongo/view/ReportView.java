package com.utp.agroalerta.infraestructure.persistence.mongo.view;

import com.utp.agroalerta.infraestructure.persistence.mongo.document.alert.CropDocument;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ReportView {
    private List<CropDocument> crops;
    private List<SiteView> sources;
    private List<String> levels;
    private Map<String, List<LocationReportView>> locations;
}