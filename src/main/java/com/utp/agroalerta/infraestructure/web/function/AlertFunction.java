package com.utp.agroalerta.infraestructure.web.function;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.alert.Alert;
import com.utp.agroalerta.domain.model.alert.AlertInfo;
import com.utp.agroalerta.domain.pagination.Pagination;
import com.utp.agroalerta.domain.ports.in.RetrieveAlertsUseCase;
import com.utp.agroalerta.infraestructure.adapters.in.CloudResponse;
import com.utp.agroalerta.infraestructure.adapters.in.SearchMapper;
import com.utp.agroalerta.infraestructure.web.dto.alert.AlertDto;
import com.utp.agroalerta.infraestructure.web.dto.alert.AlertInfoDto;
import com.utp.agroalerta.infraestructure.web.mapper.AlertDtoMapper;
import com.utp.agroalerta.shared.utils.FunctionQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlertFunction {

    private final RetrieveAlertsUseCase retrieveAlertsUseCase;
    private final AlertDtoMapper alertDtoMapper;


    @Bean(name = "findAlertById")
    public Function<String, CloudResponse<AlertDto>> findById() {
        return id -> {
            log.info("[API] findById - START");
            Alert alert = retrieveAlertsUseCase.findById(id);
            log.info("[API] findById - END");
            return CloudResponse.success(alertDtoMapper.toDto(alert), "OK");
        };
    }

    @Bean(name = "searchAlerts")
    public Function<Message<Object>, CloudResponse<List<AlertInfoDto>>> getAlerts() {
        return message -> {
            log.info("[API] getAlerts - START");

            Map<String, Object> queryParams = FunctionQuery.extractQueryParams(message);
            log.info("[API] getAlerts - Query params extracted: {}", queryParams);

            SearchCriteria criteria = SearchMapper.toDomain(queryParams);
            Pagination<AlertInfo> pagination = retrieveAlertsUseCase.getAlerts(criteria);

            Pagination<AlertInfoDto> alerts = Pagination.<AlertInfoDto>builder()
                    .data(pagination.getData().stream().map(alertDtoMapper::toDto).toList())
                    .meta(pagination.getMeta())
                    .build();

            log.info("[API] getAlerts - END");
            return CloudResponse.successPage(alerts, "OK");
        };
    }

}
