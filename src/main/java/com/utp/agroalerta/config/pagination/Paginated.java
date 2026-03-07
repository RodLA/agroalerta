package com.utp.agroalerta.config.pagination;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Paginated<T> {
    private T data;
    private Metadata meta;
}
