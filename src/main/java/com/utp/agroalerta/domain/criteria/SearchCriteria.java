package com.utp.agroalerta.domain.criteria;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class SearchCriteria {
    private int page;
    private int size;
    private String start;
    private String end;
    private Integer department;
    private Integer province;
    private String risk;
    private String event;
}
