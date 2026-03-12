package com.utp.agroalerta.infraestructure.adapters.in;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.utp.agroalerta.domain.pagination.Metadata;
import com.utp.agroalerta.domain.pagination.Pagination;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CloudResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Metadata meta;
    private LocalDateTime timestamp;

    public static <T> CloudResponse<T> success(T data, String message) {
        return CloudResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> CloudResponse<List<T>> successPage(Pagination<T> pagination, String message) {
        return CloudResponse.<List<T>>builder()
                .success(true)
                .message(message)
                .data(pagination.getData())
                .meta(pagination.getMeta())
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> CloudResponse<T> error(String message) {
        return CloudResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
