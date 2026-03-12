package com.utp.agroalerta.domain.pagination;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class Metadata {
    private long totalElements;
    private long totalItems;
    private int totalPages;
    private int page;
    private int size;
    private boolean hasNextPage;
    private boolean hasPrevPage;
}
