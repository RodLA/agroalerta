package com.utp.agroalerta.domain.model.reco;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Recommendation {
    private String id;
    private String pdfKey;
    private String domain;
    private String reco;
    private LocalDateTime processedAt;
}
