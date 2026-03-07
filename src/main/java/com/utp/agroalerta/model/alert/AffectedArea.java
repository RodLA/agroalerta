package com.utp.agroalerta.model.alert;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AffectedArea {

    @Field("department_id")
    private Long departmentId;
    @Field("department_name")
    private String departmentName;
    private List<Province> provinces;
}
