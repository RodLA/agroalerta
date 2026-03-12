package com.utp.agroalerta.infraestructure.web.dto.report;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class SiteDto {
    private String site;
    private String siteName;
}
