package com.utp.agroalerta.infraestructure.web.mapper;

import com.utp.agroalerta.domain.model.reco.Recommendation;
import com.utp.agroalerta.infraestructure.web.dto.reco.RecommendationDto;
import org.springframework.stereotype.Component;

@Component
public class RecommendationDtoMapper {

    public RecommendationDto toDto(Recommendation recommendation) {
        return RecommendationDto.builder()
                .id(recommendation.getId())
                .domain(recommendation.getDomain())
                .reco(recommendation.getReco())
                .build();
    }

    public Recommendation toDomain(RecommendationDto recommendation) {
        return Recommendation.builder()
                .id(recommendation.getId())
                .domain(recommendation.getDomain())
                .reco(recommendation.getReco())
                .build();
    }

}
