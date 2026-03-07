package com.utp.agroalerta.service;

import com.utp.agroalerta.model.AgroclimaticAlert;

import java.util.List;
import java.util.Optional;

public interface AgroclimaticAlertService {
    AgroclimaticAlert save(AgroclimaticAlert agroclimaticAlert);
    List<AgroclimaticAlert> findAll();
    Optional<AgroclimaticAlert> findById(String id);
    void deleteById(String id);
    AgroclimaticAlert update(String id, AgroclimaticAlert agroclimaticAlert);
}
