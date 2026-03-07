package com.utp.agroalerta.dto;

import com.utp.agroalerta.model.location.MetaInfo;
import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class DepartmentDto {
    private String id;
    private Integer ubigeo;
    private String name;
    private MetaInfo metaInfo;
}
