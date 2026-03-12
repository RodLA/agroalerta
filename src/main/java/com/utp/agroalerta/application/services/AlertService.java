package com.utp.agroalerta.application.services;

import com.utp.agroalerta.application.exceptions.AlertNotFoundException;
import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.alert.Alert;
import com.utp.agroalerta.domain.model.alert.AlertInfo;
import com.utp.agroalerta.domain.pagination.Pagination;
import com.utp.agroalerta.domain.ports.in.RetrieveAlertsUseCase;
import com.utp.agroalerta.domain.ports.out.AlertRepositoryPort;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AlertService implements RetrieveAlertsUseCase {

    private final AlertRepositoryPort alertRepositoryPort;

    @Override
    public Alert findById(String id) {
        return alertRepositoryPort.findById(id)
                .orElseThrow(() -> new AlertNotFoundException(id));
    }

    @Override
    public Pagination<AlertInfo> getAlerts(SearchCriteria criteria) {
        return alertRepositoryPort.getAlerts(criteria);
    }
}
