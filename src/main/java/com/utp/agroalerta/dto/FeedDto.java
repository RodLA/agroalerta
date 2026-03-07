package com.utp.agroalerta.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class FeedDto {

    private List<CropDto> crops;
    private List<SourceDto> sources;
    private List<String> levels;
    private Map<String, List<LocationFeedDto>> locations;

}
