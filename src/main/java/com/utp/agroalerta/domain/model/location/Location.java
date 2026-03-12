package com.utp.agroalerta.domain.model.location;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Location {
    private String id;
    private String parentId;
    private Integer ubigeo;
    private String name;
    private String type;
    private MetaInfo metaInfo;
    private Boolean isActive;
}
