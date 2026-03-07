package com.utp.agroalerta.service;

import com.utp.agroalerta.model.AgroclimaticAlert;
import com.utp.agroalerta.repository.AgroclimaticAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgroclimaticAlertServiceImpl implements AgroclimaticAlertService {

    @Autowired
    private AgroclimaticAlertRepository agroclimaticAlertRepository;

    @Override
    public AgroclimaticAlert save(AgroclimaticAlert agroclimaticAlert) {
        return agroclimaticAlertRepository.save(agroclimaticAlert);
    }

    @Override
    public List<AgroclimaticAlert> findAll() {
        return agroclimaticAlertRepository.findAll();
    }

    @Override
    public Optional<AgroclimaticAlert> findById(String id) {
        return agroclimaticAlertRepository.findById(id);
    }

    @Override
    public void deleteById(String id) {
        agroclimaticAlertRepository.deleteById(id);
    }

    @Override
    public AgroclimaticAlert update(String id, AgroclimaticAlert agroclimaticAlert) {
        agroclimaticAlert.setId(id);
        return agroclimaticAlertRepository.save(agroclimaticAlert);
    }
}
