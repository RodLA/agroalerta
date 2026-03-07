package com.utp.agroalerta.config.pagination;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@Slf4j
@Getter @Setter @SuperBuilder
@NoArgsConstructor @AllArgsConstructor
public class Paginate extends Filter {
    private int page;
    private int size;

    public static Paginate fromQueryParams(Map<String, Object> query) {
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

        return Paginate.builder()
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

}
