package com.utp.agroalerta.infraestructure.persistence.mongo.repository;

import com.utp.agroalerta.infraestructure.persistence.mongo.document.reco.RecommendationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecommendationMongoRepository extends MongoRepository<RecommendationDocument, String> {
}
