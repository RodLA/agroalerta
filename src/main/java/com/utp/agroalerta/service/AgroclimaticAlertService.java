package com.utp.agroalerta.service;

import com.utp.agroalerta.config.pagination.Filter;
import com.utp.agroalerta.config.pagination.Paginate;
import com.utp.agroalerta.config.pagination.Paginated;
import com.utp.agroalerta.dto.AgroclimaticAlertDto;
import com.utp.agroalerta.dto.FeedDto;
import com.utp.agroalerta.dto.StatisticDto;
import com.utp.agroalerta.model.alert.AgroclimaticAlert;

import java.util.List;

public interface AgroclimaticAlertService {
    Paginated<List<AgroclimaticAlertDto>> findAll(Paginate pagination);
    AgroclimaticAlert findById(String id);
    StatisticDto getStatistics();
    FeedDto getFeed(Filter filter);
}
