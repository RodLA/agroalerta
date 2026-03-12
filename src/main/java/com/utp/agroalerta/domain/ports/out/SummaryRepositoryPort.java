package com.utp.agroalerta.domain.ports.out;

import com.utp.agroalerta.domain.model.report.Summary;

import java.util.Optional;

public interface SummaryRepositoryPort {
    Optional<Summary> getSummary();
}
