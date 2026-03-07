package com.utp.agroalerta.config.cloud;

import com.utp.agroalerta.config.pagination.Filter;
import com.utp.agroalerta.config.pagination.Paginate;
import com.utp.agroalerta.config.pagination.Paginated;
import com.utp.agroalerta.config.response.CloudResponse;
import com.utp.agroalerta.dto.AgroclimaticAlertDto;
import com.utp.agroalerta.dto.FeedDto;
import com.utp.agroalerta.dto.StatisticDto;
import com.utp.agroalerta.model.alert.AgroclimaticAlert;
import com.utp.agroalerta.service.AgroclimaticAlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlertFunctions {

    private final AgroclimaticAlertService service;

    @Bean(name = "health")
    public Supplier<String> health() {
        return () -> "Ok";
    }

    @Bean(name = "statistics")
    public Supplier<CloudResponse<StatisticDto>> getStatistics() {
        return () -> {
            log.info("[API] getStatistics - START");
            StatisticDto data = service.getStatistics();

            return CloudResponse.success(data, "OK");
        };
    }

    @Bean(name = "alert-detail")
    public Function<String, CloudResponse<AgroclimaticAlert>> findById() {
        return id -> {
            log.info("[API] findById - START");
            AgroclimaticAlert data = service.findById(id);

            return CloudResponse.success(data, "OK");
        };
    }

    @Bean(name = "alerts")
    public Function<Message<Object>, CloudResponse<List<AgroclimaticAlertDto>>> findAll() {
        return message -> {
            log.info("[API] findAll - START");

            // 1. Atrapamos el payload (En AWS esto será el JSON completo del evento)
            Object payload = message.getPayload();
            log.info("Payload recibido: {}", payload);

            Map<String, Object> queryParams = new HashMap<>();

            // 2. Lógica para extraer los parámetros si estamos en AWS Lambda
            if (payload instanceof Map) {
                Map<String, Object> awsEvent = (Map<String, Object>) payload;

                if (awsEvent.containsKey("queryStringParameters") && awsEvent.get("queryStringParameters") != null) {
                    // AWS entrega los query params como un Map<String, String>
                    Map<String, String> awsParams = (Map<String, String>) awsEvent.get("queryStringParameters");
                    queryParams.putAll(awsParams);
                    log.info("Query params extraídos de AWS: {}", queryParams);
                }
            }
            // 3. Fallback: Lógica para tu entorno local (localhost:8080)
            else if (message.getHeaders().containsKey("http_request_param") && message.getHeaders().get("http_request_param") != null) {
                queryParams = (Map<String, Object>) message.getHeaders().get("http_request_param");
                log.info("Query params extraídos de entorno local: {}", queryParams);
            }

            Paginate pagination = Paginate.fromQueryParams(queryParams);
            Paginated<List<AgroclimaticAlertDto>> data = service.findAll(pagination);

            return CloudResponse.successPage(data, "OK");
        };
    }

    @Bean("alerts-feed")
    public Function<Message<Object>, CloudResponse<FeedDto>> getFeed() {
        return message -> {
            log.info("[API] getFeed - START");
            // 1. Atrapamos el payload (En AWS esto será el JSON completo del evento)
            Object payload = message.getPayload();
            log.info("Payload recibido: {}", payload);

            Map<String, Object> queryParams = new HashMap<>();

            // 2. Lógica para extraer los parámetros si estamos en AWS Lambda
            if (payload instanceof Map) {
                Map<String, Object> awsEvent = (Map<String, Object>) payload;

                if (awsEvent.containsKey("queryStringParameters") && awsEvent.get("queryStringParameters") != null) {
                    // AWS entrega los query params como un Map<String, String>
                    Map<String, String> awsParams = (Map<String, String>) awsEvent.get("queryStringParameters");
                    queryParams.putAll(awsParams);
                    log.info("Query params extraídos de AWS: {}", queryParams);
                }
            }
            // 3. Fallback: Lógica para tu entorno local (localhost:8080)
            else if (message.getHeaders().containsKey("http_request_param") && message.getHeaders().get("http_request_param") != null) {
                queryParams = (Map<String, Object>) message.getHeaders().get("http_request_param");
                log.info("Query params extraídos de entorno local: {}", queryParams);
            }

            Filter filter = Filter.fromQueryParams(queryParams);
            FeedDto data = service.getFeed(filter);

            return CloudResponse.success(data, "OK");
        };
    }
}
