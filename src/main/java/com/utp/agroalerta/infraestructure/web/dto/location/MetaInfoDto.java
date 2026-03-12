package com.utp.agroalerta.infraestructure.web.dto.location;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MetaInfoDto {
    private Double latitude;
    private Double longitude;
    private Integer zoom;
}
