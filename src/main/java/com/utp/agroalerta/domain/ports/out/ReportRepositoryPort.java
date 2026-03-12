package com.utp.agroalerta.domain.ports.out;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.report.Report;

import java.util.Optional;

public interface ReportRepositoryPort {
    Optional<Report> getReport(SearchCriteria criteria);
}
