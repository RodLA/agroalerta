package com.utp.agroalerta.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class VulnerableCrop {

    @Field("crop_id")
    private String cropId;
    @Field("crop_name")
    private String cropName;
}
