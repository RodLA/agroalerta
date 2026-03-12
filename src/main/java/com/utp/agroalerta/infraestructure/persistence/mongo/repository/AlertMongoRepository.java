package com.utp.agroalerta.infraestructure.persistence.mongo.repository;

import com.utp.agroalerta.infraestructure.persistence.mongo.document.alert.AlertDocument;
import com.utp.agroalerta.infraestructure.persistence.mongo.projection.AlertProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface AlertMongoRepository extends MongoRepository<AlertDocument, String> {

    @Query(value = "{ " +
            "    'risk_date': { $gte: ?0, $lte: ?1 }," +
            "    $and: [" +
            "        { $or: [ { $expr: { $eq: [ '?2', 'null' ] } }, { 'risk': ?2 } ] }," +
            "        { $or: [ { $expr: { $eq: [ '?3', 'null' ] } }, { 'event.id': ?3 } ] }," +
            "        { $or: [ { $expr: { $eq: [ '?4', 'null' ] } }, { 'department_ids': ?4 } ] }," +
            "        { $or: [ { $expr: { $eq: [ '?5', 'null' ] } }, { 'province_ids': ?5 } ] }" +
            "    ]" +
            "}", sort = "{ 'risk_date' : 1 }")
    Page<AlertProjection> getAlerts(String startDate, String endDate, String risk, String event, Integer departmentId, Integer provinceId, Pageable pageable);

}
