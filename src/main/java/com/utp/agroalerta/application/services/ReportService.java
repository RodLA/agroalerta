package com.utp.agroalerta.application.services;

import com.utp.agroalerta.application.exceptions.SummaryNotFoundException;
import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.report.Report;
import com.utp.agroalerta.domain.ports.in.RetrieveReportUseCase;
import com.utp.agroalerta.domain.ports.out.ReportRepositoryPort;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ReportService implements RetrieveReportUseCase {

    private final ReportRepositoryPort reportRepositoryPort;

    @Override
    public Report getReport(SearchCriteria criteria) {
        return reportRepositoryPort.getReport(criteria)
                .orElseThrow(SummaryNotFoundException::new);
    }
}
