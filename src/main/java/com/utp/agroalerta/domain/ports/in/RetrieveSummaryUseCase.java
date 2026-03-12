package com.utp.agroalerta.domain.ports.in;

import com.utp.agroalerta.domain.model.report.Summary;

public interface RetrieveSummaryUseCase {
    Summary getSummary();
}
