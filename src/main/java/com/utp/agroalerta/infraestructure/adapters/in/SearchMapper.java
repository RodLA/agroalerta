package com.utp.agroalerta.infraestructure.adapters.in;

import com.utp.agroalerta.domain.criteria.SearchCriteria;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

public class SearchMapper {

    public static SearchCriteria toDomain(Map<String, Object> query) {
        int page = getIntValue(query, "page").orElse(0);
        int size = getIntValue(query, "size").orElse(6);
        LocalDate startDate = getLocalDateValue(query, "startDate").orElse(LocalDate.now());
        LocalDate endDate = getLocalDateValue(query, "endDate").orElse(LocalDate.now().plusMonths(3L));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        return SearchCriteria.builder()
                .page(page)
                .size(size)
                .startDate(startDate.format(formatter))
                .endDate(endDate.format(formatter))
                .department(getIntValue(query, "department").orElse(null))
                .province(getIntValue(query, "province").orElse(null))
                .risk(getStringValue(query, "risk"))
                .event(getStringValue(query, "event"))
                .build();
    }

    public static SearchCriteria toReport(Map<String, Object> query) {
        LocalDate startDate = getLocalDateValue(query, "startDate").orElse(null);
        LocalDate endDate = getLocalDateValue(query, "endDate").orElse(null);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        return SearchCriteria.builder()
                .startDate(Objects.isNull(startDate) ? null : startDate.format(formatter))
                .endDate(Objects.isNull(endDate) ? null : endDate.format(formatter))
                .department(getIntValue(query, "department").orElse(null))
                .build();
    }

    private static Optional<Integer> getIntValue(Map<String, Object> map, String key) {
        return Optional.ofNullable(map.get(key)).map(v -> Integer.parseInt(v.toString()));
    }

    private static Optional<LocalDate> getLocalDateValue(Map<String, Object> map, String key) {
        return Optional.ofNullable(map.get(key)).map(v -> LocalDate.parse(v.toString()));
    }

    private static String getStringValue(Map<String, Object> map, String key) {
        return (String) map.get(key);
    }

}
