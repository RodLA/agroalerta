package com.utp.agroalerta.config.pagination;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class PageAndFilters {
    private int page;
    private int size;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer department;
    private Integer province;
    private String risk;
    private String event;

    public static PageAndFilters fromQueryParams(Map<String, Object> query) {
        int page = getIntValue(query, "page", 0);
        int size = getIntValue(query, "size", 6);
        LocalDate startDate = getLocalDateValue(query, "startDate", LocalDate.now().minusMonths(1L));
        LocalDate endDate = getLocalDateValue(query, "endDate", LocalDate.now());
        Integer department = getIntValue(query, "department");
        Integer province = getIntValue(query, "province");
        String risk = getStringValue(query, "risk");
        String event = getStringValue(query, "event");

        log.info("[Filters] page: {}, size: {}, startDate: {}, endDate: {}, department: {}, province: {}, risk: {}, event: {}",
                page, size, startDate, endDate, department, province, risk, event);

        return PageAndFilters.builder()
                .page(page)
                .size(size)
                .startDate(startDate.atStartOfDay())
                .endDate(endDate.atTime(LocalTime.MAX))
                .department(department)
                .province(province)
                .risk(risk)
                .event(event)
                .build();
    }

    private static String getStringValue(Map<String, Object> query, String key) {
        Object value = query.get(key);
        return Objects.isNull(value) ? null : value.toString();
    }

    private static Integer getIntValue(Map<String, Object> query, String key) {
        Object value = query.get(key);
        return Objects.isNull(value) ? null : Integer.parseInt(value.toString());
    }

    private static int getIntValue(Map<String, Object> query, String key, int defaultValue) {
        Object value = query.get(key);
        if (Objects.isNull(value)) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            log.warn("Could not parse integer for key '{}'. Using default value {}.", key, defaultValue);
            return defaultValue;
        }
    }

    private static LocalDate getLocalDateValue(Map<String, Object> query, String key, LocalDate defaultValue) {
        Object value = query.get(key);
        if (Objects.isNull(value)) {
            return defaultValue;
        }
        try {
            return LocalDate.parse(value.toString());
        } catch (DateTimeParseException e) {
            log.warn("Could not parse date for key '{}'. Using default value {}.", key, defaultValue);
            return defaultValue;
        }
    }
}
