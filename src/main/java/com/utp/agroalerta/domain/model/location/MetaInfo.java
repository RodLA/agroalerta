package com.utp.agroalerta.domain.model.location;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MetaInfo {
    private Double latitude;
    private Double longitude;
    private Integer zoom;
}
