package com.utp.agroalerta.config.pagination;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Getter @Setter @SuperBuilder
@NoArgsConstructor @AllArgsConstructor
public class Filter {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer department;
    private Integer province;
    private String risk;
    private String event;

    public static Filter fromQueryParams(Map<String, Object> query) {
        LocalDate startDate = getLocalDateValue(query, "startDate", LocalDate.now().minusMonths(1L));
        LocalDate endDate = getLocalDateValue(query, "endDate", LocalDate.now());
        Integer department = getIntValue(query, "department");
        Integer province = getIntValue(query, "province");
        String risk = getStringValue(query, "risk");
        String event = getStringValue(query, "event");

        return Filter.builder()
                .startDate(startDate.atStartOfDay())
                .endDate(endDate.atTime(LocalTime.MAX))
                .department(department)
                .province(province)
                .risk(risk)
                .event(event)
                .build();
    }

    protected static String getStringValue(Map<String, Object> query, String key) {
        Object value = query.get(key);
        return Objects.isNull(value) ? null : value.toString();
    }

    protected static Integer getIntValue(Map<String, Object> query, String key) {
        Object value = query.get(key);
        return Objects.isNull(value) ? null : Integer.parseInt(value.toString());
    }

    protected static int getIntValue(Map<String, Object> query, String key, int defaultValue) {
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

    protected static LocalDate getLocalDateValue(Map<String, Object> query, String key, LocalDate defaultValue) {
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
