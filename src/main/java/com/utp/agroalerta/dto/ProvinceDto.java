package com.utp.agroalerta.dto;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ProvinceDto {
    private Integer ubigeo;
    private String parentId;
    private String name;
}
