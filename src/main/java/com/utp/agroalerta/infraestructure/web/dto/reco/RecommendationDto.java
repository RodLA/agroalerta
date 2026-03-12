package com.utp.agroalerta.infraestructure.web.dto.reco;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class RecommendationDto {
    private String id;
    private String domain;
    private String reco;
}
