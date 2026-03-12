package com.utp.agroalerta.infraestructure.persistence.mongo.document.location;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class MetaInfoDocument {
    private Double latitude;
    private Double longitude;
    private Integer zoom;
}
