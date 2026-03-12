package com.utp.agroalerta.infraestructure.adapters.out;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.alert.Alert;
import com.utp.agroalerta.domain.model.alert.AlertInfo;
import com.utp.agroalerta.domain.pagination.Metadata;
import com.utp.agroalerta.domain.pagination.Pagination;
import com.utp.agroalerta.domain.ports.out.AlertRepositoryPort;
import com.utp.agroalerta.infraestructure.persistence.mongo.mapper.AlertMongoMapper;
import com.utp.agroalerta.infraestructure.persistence.mongo.projection.AlertProjection;
import com.utp.agroalerta.infraestructure.persistence.mongo.repository.AlertMongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AlertMongoAdapter implements AlertRepositoryPort {

    private final AlertMongoRepository alertMongoRepository;
    private final AlertMongoMapper alertMongoMapper;

    @Override
    public Optional<Alert> findById(String id) {
        return alertMongoRepository.findById(id)
                .map(alertMongoMapper::toDomain);
    }

    @Override
    public Pagination<AlertInfo> getAlerts(SearchCriteria criteria) {
        Pageable pageable = Pageable.ofSize(criteria.getSize()).withPage(criteria.getPage());
        Page<AlertProjection> page = alertMongoRepository.getAlerts(
                criteria.getStartDate(),
                criteria.getEndDate(),
                criteria.getRisk(),
                criteria.getEvent(),
                criteria.getDepartment(),
                criteria.getProvince(),
                pageable
        );

        return Pagination.<AlertInfo>builder()
                .data(page.getContent().stream().map(alertMongoMapper::toDomain).toList())
                .meta(Metadata.builder()
                        .totalElements(page.getTotalElements())
                        .totalItems(page.getNumberOfElements())
                        .totalPages(page.getTotalPages())
                        .page(criteria.getPage())
                        .size(criteria.getSize())
                        .hasPrevPage(page.hasPrevious())
                        .hasNextPage(page.hasNext())
                        .build()
                )
                .build();
    }
}
