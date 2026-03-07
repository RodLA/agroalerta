package com.utp.agroalerta.dto;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationFeedDto {

    private Integer locationId;
    private String level;
    private Integer count;

}
