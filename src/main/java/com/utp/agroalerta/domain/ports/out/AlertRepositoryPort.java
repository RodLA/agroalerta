package com.utp.agroalerta.domain.ports.out;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.alert.Alert;
import com.utp.agroalerta.domain.model.alert.AlertInfo;
import com.utp.agroalerta.domain.pagination.Pagination;

import java.util.Optional;

public interface AlertRepositoryPort {
    Optional<Alert> findById(String id);
    Pagination<AlertInfo> getAlerts(SearchCriteria criteria);
}
