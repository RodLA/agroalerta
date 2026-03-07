package com.utp.agroalerta.model.location;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MetaInfo {
    private Double latitude;
    private Double longitude;
    private Integer zoom;
}
