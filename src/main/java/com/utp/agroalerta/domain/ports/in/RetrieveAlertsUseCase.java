package com.utp.agroalerta.domain.ports.in;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.alert.Alert;
import com.utp.agroalerta.domain.model.alert.AlertInfo;
import com.utp.agroalerta.domain.pagination.Pagination;

public interface RetrieveAlertsUseCase {
    Alert findById(String id);
    Pagination<AlertInfo> getAlerts(SearchCriteria criteria);
}
