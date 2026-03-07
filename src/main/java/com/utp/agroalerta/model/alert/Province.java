package com.utp.agroalerta.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Province {

    @Field("province_id")
    private Long provinceId;
    @Field("province_name")
    private String provinceName;
}
