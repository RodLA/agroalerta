package com.utp.agroalerta.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OfficialSource {

    @Field("source_id")
    private String sourceId;
    @Field("source_name")
    private String sourceName;
    @Field("source_url")
    private String sourceUrl;
}
