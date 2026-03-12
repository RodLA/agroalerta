package com.utp.agroalerta.infraestructure.adapters.out;

import com.utp.agroalerta.domain.model.report.Summary;
import com.utp.agroalerta.domain.ports.out.SummaryRepositoryPort;
import com.utp.agroalerta.infraestructure.persistence.mongo.mapper.SummaryMongoMapper;
import com.utp.agroalerta.infraestructure.persistence.mongo.view.SummaryView;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SummaryMongoAdapter implements SummaryRepositoryPort {

    private final MongoTemplate mongoTemplate;
    private final SummaryMongoMapper summaryMongoMapper;

    @Override
    public Optional<Summary> getSummary() {
        return Optional.ofNullable(
                summaryMongoMapper.toDomain(
                        Objects.requireNonNull(
                                mongoTemplate.findOne(new Query(), SummaryView.class, "alert_summary")
                        )
                )
        );
    }
}
