package com.utp.agroalerta.repository;

import com.utp.agroalerta.model.alert.AgroclimaticAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgroclimaticAlertRepository extends MongoRepository<AgroclimaticAlert, String> {
    Optional<AgroclimaticAlert> findByEventType(String eventType);
}
