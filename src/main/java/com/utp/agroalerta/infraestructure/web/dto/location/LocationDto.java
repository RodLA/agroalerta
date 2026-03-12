package com.utp.agroalerta.infraestructure.web.dto.location;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocationDto {
    private String id;
    private Integer ubigeo;
    private String name;
    private MetaInfoDto metaInfo;
}
