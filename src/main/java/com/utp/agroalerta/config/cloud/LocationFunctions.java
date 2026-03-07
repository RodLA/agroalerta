package com.utp.agroalerta.config.cloud;

import com.utp.agroalerta.config.pagination.PageAndFilters;
import com.utp.agroalerta.config.pagination.Paginated;
import com.utp.agroalerta.config.response.CloudResponse;
import com.utp.agroalerta.dto.AgroclimaticAlertDto;
import com.utp.agroalerta.dto.StatisticDto;
import com.utp.agroalerta.model.AgroclimaticAlert;
import com.utp.agroalerta.service.AgroclimaticAlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlertsFunctions {

    private final AgroclimaticAlertService service;

    @Bean(name = "health")
    public Supplier<String> health() {
        return () -> "Ok";
    }

    @Bean(name = "statistics")
    public Supplier<CloudResponse<StatisticDto>> getStatistics() {
        return () -> {
            log.info("[API] globalStatistics - START");
            StatisticDto data = service.getStatistics();

            return CloudResponse.success(data, "OK");
        };
    }

    @Bean(name = "detail-alert")
    public Function<String, CloudResponse<AgroclimaticAlert>> findById() {
        return id -> {
            log.info("[API] getDetailAlert - START");
            AgroclimaticAlert data = service.findById(id);

            return CloudResponse.success(data, "OK");
        };
    }

    @Bean(name = "alerts")
    public Function<Message<Void>, CloudResponse<List<AgroclimaticAlertDto>>> findAll() {
        return message -> {
            log.info("[API] getAlerts - START");
            MessageHeaders headers = message.getHeaders();
            Map<String, Object> queryParams = Objects.nonNull(headers.get("http_request_param")) ?
                    (Map<String, Object>) headers.get("http_request_param") : Map.of();
            PageAndFilters pagination = PageAndFilters.fromQueryParams(queryParams);

            Paginated<List<AgroclimaticAlertDto>> data = service.findAll(pagination);

            return CloudResponse.successPage(data, "OK");
        };
    }
}
