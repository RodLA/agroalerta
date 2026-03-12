package com.utp.agroalerta.domain.model.report;

import com.utp.agroalerta.domain.model.alert.Crop;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Report {
    private List<Crop> crops;
    private List<Site> sources;
    private List<String> levels;
    private Map<String, List<LocationReport>> locations;
}
