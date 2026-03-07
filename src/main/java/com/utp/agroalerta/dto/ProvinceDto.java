package com.utp.agroalerta.dto;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationDto {
    private Integer ubigeo;
    private String parentId;
    private String name;
    private String type;
}
