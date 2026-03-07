package com.utp.agroalerta.repository;

import com.utp.agroalerta.model.AgroclimaticAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgroclimaticAlertRepository extends MongoRepository<AgroclimaticAlert, String> {
}
