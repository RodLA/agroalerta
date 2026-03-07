package com.utp.agroalerta.config.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.utp.agroalerta.config.pagination.Metadata;
import com.utp.agroalerta.config.pagination.Paginated;
import lombok.*;

import java.time.LocalDateTime;

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

    public static <T> CloudResponse<T> successPage(Paginated<T> page, String message) {
        return CloudResponse.<T>builder()
                .success(true)
                .message(message)
                .data(page.getData())
                .meta(page.getMeta())
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
