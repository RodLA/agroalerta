package com.utp.agroalerta.domain.model.alert;

import lombok.*;

import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Department {
    private Long id;
    private String name;
    private List<Province> provinces;
}
