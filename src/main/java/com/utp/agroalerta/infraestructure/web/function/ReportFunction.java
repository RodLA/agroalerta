package com.utp.agroalerta.infraestructure.web.function;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.report.Report;
import com.utp.agroalerta.domain.model.report.Summary;
import com.utp.agroalerta.domain.ports.in.RetrieveReportUseCase;
import com.utp.agroalerta.domain.ports.in.RetrieveSummaryUseCase;
import com.utp.agroalerta.infraestructure.adapters.in.CloudResponse;
import com.utp.agroalerta.infraestructure.adapters.in.SearchMapper;
import com.utp.agroalerta.infraestructure.web.dto.report.ReportDto;
import com.utp.agroalerta.infraestructure.web.dto.report.SummaryDto;
import com.utp.agroalerta.infraestructure.web.mapper.ReportDtoMapper;
import com.utp.agroalerta.infraestructure.web.mapper.SummaryDtoMapper;
import com.utp.agroalerta.shared.utils.FunctionQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReportFunction {

    private final RetrieveSummaryUseCase retrieveSummaryUseCase;
    private final RetrieveReportUseCase retrieveReportUseCase;

    private final SummaryDtoMapper summaryDtoMapper;
    private final ReportDtoMapper reportDtoMapper;

    @Bean(name = "getSummary")
    public Supplier<CloudResponse<SummaryDto>> getSummary() {
        return () -> {
            log.info("[API] getSummary - START");
            Summary summary = retrieveSummaryUseCase.getSummary();
            log.info("[API] getSummary - END");
            return CloudResponse.success(summaryDtoMapper.toDto(summary), "OK");
        };
    }

    @Bean("getReport")
    public Function<Message<Object>, CloudResponse<ReportDto>> getReport() {
        return message -> {
            log.info("[API] getReport - START");

            Map<String, Object> queryParams = FunctionQuery.extractQueryParams(message);
            log.info("[API] getReport - Query params extracted: {}", queryParams);

            SearchCriteria criteria = SearchMapper.toReport(queryParams);
            Report report = retrieveReportUseCase.getReport(criteria);

            log.info("[API] getReport - END");
            return CloudResponse.success(reportDtoMapper.toDto(report), "OK");
        };
    }

}
