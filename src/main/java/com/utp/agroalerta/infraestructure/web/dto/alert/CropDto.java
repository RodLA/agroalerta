package com.utp.agroalerta.infraestructure.web.dto.alert;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class CropDto {
    private String id;
    private String name;
}
