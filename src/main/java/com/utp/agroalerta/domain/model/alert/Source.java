package com.utp.agroalerta.domain.model.alert;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Source {
    private String document;
    private String title;
    private String url;
    private LocalDateTime discoveredAt;
    private String site;
    private String siteName;
}
