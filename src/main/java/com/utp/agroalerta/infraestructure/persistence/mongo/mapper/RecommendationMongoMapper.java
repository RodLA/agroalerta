package com.utp.agroalerta.infraestructure.persistence.mongo.mapper;

import com.utp.agroalerta.domain.model.reco.Recommendation;
import com.utp.agroalerta.infraestructure.persistence.mongo.document.reco.RecommendationDocument;
import org.springframework.stereotype.Component;

@Component
public class RecommendationMongoMapper {

    public RecommendationDocument toDocument(Recommendation recommendation) {
        return RecommendationDocument.builder()
                .id(recommendation.getId())
                .domain(recommendation.getDomain())
                .reco(recommendation.getReco())
                .build();
    }

    public Recommendation toDomain(RecommendationDocument recommendation) {
        return Recommendation.builder()
                .id(recommendation.getId())
                .domain(recommendation.getDomain())
                .reco(recommendation.getReco())
                .build();
    }

}
