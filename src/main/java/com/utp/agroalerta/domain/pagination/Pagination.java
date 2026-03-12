package com.utp.agroalerta.domain.pagination;

import lombok.*;

import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Pagination<T> {
    private List<T> data;
    private Metadata meta;
}