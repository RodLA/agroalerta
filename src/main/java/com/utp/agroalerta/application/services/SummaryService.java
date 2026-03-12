package com.utp.agroalerta.application.services;

import com.utp.agroalerta.application.exceptions.SummaryNotFoundException;
import com.utp.agroalerta.domain.model.report.Summary;
import com.utp.agroalerta.domain.ports.in.RetrieveSummaryUseCase;
import com.utp.agroalerta.domain.ports.out.SummaryRepositoryPort;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class SummaryService implements RetrieveSummaryUseCase {

    private final SummaryRepositoryPort summaryRepositoryPort;

    @Override
    public Summary getSummary() {
        return summaryRepositoryPort.getSummary()
                .orElseThrow(SummaryNotFoundException::new);
    }

}
