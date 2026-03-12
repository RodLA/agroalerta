package com.utp.agroalerta.domain.ports.in;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.report.Report;

public interface RetrieveReportUseCase {
    Report getReport(SearchCriteria criteria);
}
