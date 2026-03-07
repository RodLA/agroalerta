package com.utp.agroalerta.service;

import com.utp.agroalerta.config.exception.ResourceNotFoundException;
import com.utp.agroalerta.config.pagination.Filter;
import com.utp.agroalerta.config.pagination.Metadata;
import com.utp.agroalerta.config.pagination.Paginate;
import com.utp.agroalerta.config.pagination.Paginated;
import com.utp.agroalerta.config.response.CloudResponse;
import com.utp.agroalerta.dto.*;
import com.utp.agroalerta.mappers.AgroclimaticAlertMapper;
import com.utp.agroalerta.model.alert.AgroclimaticAlert;
import com.utp.agroalerta.model.alert.OfficialSource;
import com.utp.agroalerta.model.alert.VulnerableCrop;
import com.utp.agroalerta.repository.AgroclimaticAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgroclimaticAlertServiceImpl implements AgroclimaticAlertService {

    private final AgroclimaticAlertRepository repository;
    private final MongoTemplate mongoTemplate;

    private static final String PUBLICATION_AT = "publicationAt";
    private final Supplier<CloudResponse<List<DepartmentDto>>> departments;

    @Override
    public Paginated<List<AgroclimaticAlertDto>> findAll(Paginate filters) {
        log.info("[Service] Iniciando la obtención de alertas paginadas con filtros");

        Pageable pageable = PageRequest.of(filters.getPage(), filters.getSize());
        Query query = buildFilteredQuery(filters);
        query.with(pageable);

        Page<AgroclimaticAlert> alertsPage = PageableExecutionUtils.getPage(
                mongoTemplate.find(query, AgroclimaticAlert.class),
                pageable,
                () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), AgroclimaticAlert.class)
        );

        List<AgroclimaticAlertDto> dtoList = alertsPage.getContent().stream()
                .map(AgroclimaticAlertMapper::toDto)
                .toList();

        Metadata metadata = Metadata.builder()
                .totalElements(alertsPage.getTotalElements())
                .totalItems(alertsPage.getNumberOfElements())
                .totalPages(alertsPage.getTotalPages())
                .page(alertsPage.getNumber())
                .size(alertsPage.getSize())
                .hasNextPage(alertsPage.hasNext())
                .hasPrevPage(alertsPage.hasPrevious())
                .build();

        return Paginated.<List<AgroclimaticAlertDto>>builder()
                .data(dtoList)
                .meta(metadata)
                .build();
    }

    @Override
    public AgroclimaticAlert findById(String id) {
        log.info("[Service] Iniciando la obtención de detalle de alerta.");
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("No se encontró la alerta"));
    }

    @Override
    public StatisticDto getStatistics() {
        log.info("[Service] Iniciando la obtención de estadísticas.");
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        Query query = new Query();
        query.addCriteria(Criteria.where(PUBLICATION_AT).gte(startOfMonth));

        List<AgroclimaticAlert> alerts = mongoTemplate.find(query, AgroclimaticAlert.class);

        int totalAlerts = alerts.size();
        int criticalAlerts = (int) alerts.stream()
                .filter(alert -> "MUY ALTO".equals(alert.getRiskLevel()))
                .count();
        int affectedDepartments = (int) alerts.stream()
                .flatMap(alert -> alert.getDepartments().stream())
                .distinct()
                .count();
        LocalDateTime lastUpdate = alerts.stream()
                .map(AgroclimaticAlert::getPublicationAt)
                .max(Comparator.naturalOrder())
                .orElse(null);

        return StatisticDto.builder()
                .totalAlerts(totalAlerts)
                .criticalAlerts(criticalAlerts)
                .affectedDepartments(affectedDepartments)
                .lastUpdate(lastUpdate)
                .build();
    }

    @Override
    public FeedDto getFeed(Filter filter) {
        log.info("[Service] Iniciando la obtención de feed de alertas");

        Query query = buildFilteredQuery(filter);
        List<AgroclimaticAlert> alerts = mongoTemplate.find(query, AgroclimaticAlert.class);

        Map<String, Long> cropCounts = alerts.stream()
                .flatMap(alert -> alert.getVulnerableCrops().stream())
                .collect(Collectors.groupingBy(VulnerableCrop::getCropId, Collectors.counting()));

        List<CropDto> crops = cropCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> {
                    String cropId = entry.getKey();
                    String cropName = alerts.stream()
                            .flatMap(alert -> alert.getVulnerableCrops().stream())
                            .filter(crop -> crop.getCropId().equals(cropId))
                            .findFirst()
                            .map(VulnerableCrop::getCropName)
                            .orElse("");
                    return new CropDto(cropId, cropName);
                })
                .toList();

        Map<String, Long> sourceCounts = alerts.stream()
                .map(alert -> alert.getSourceDocument().getOfficialSource())
                .collect(Collectors.groupingBy(OfficialSource::getSourceId, Collectors.counting()));

        List<SourceDto> sources = sourceCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> {
                    String sourceId = entry.getKey();
                    String sourceName = alerts.stream()
                            .map(alert -> alert.getSourceDocument().getOfficialSource())
                            .filter(source -> source.getSourceId().equals(sourceId))
                            .findFirst()
                            .map(OfficialSource::getSourceName)
                            .orElse("");
                    return new SourceDto(sourceId, sourceName);
                })
                .toList();

        List<String> levels = alerts.stream()
                .map(AgroclimaticAlert::getRiskLevel)
                .distinct()
                .toList();

        Map<AlertGroupKey, Long> countedAlerts = alerts.stream()
                .flatMap(alert -> alert.getVulnerableCrops().stream()
                        .flatMap(crop -> (filter.getDepartment() == null ? alert.getDepartments() : alert.getProvinces()).stream()
                                .map(locationId -> new AlertGroupKey(crop.getCropId(), locationId, alert.getRiskLevel()))
                        )
                )
                .collect(Collectors.groupingBy(key -> key, Collectors.counting()));

        Map<String, List<LocationFeedDto>> locations = countedAlerts.entrySet().stream()
                .collect(Collectors.groupingBy(
                        entry -> entry.getKey().cropId(),
                        Collectors.mapping(entry -> LocationFeedDto.builder()
                                .locationId(entry.getKey().locationId())
                                .level(entry.getKey().riskLevel())
                                .count(entry.getValue().intValue())
                                .build(), Collectors.toList())
                ));

        return FeedDto.builder()
                .crops(crops)
                .sources(sources)
                .levels(levels)
                .locations(locations)
                .build();
    }

    private Query buildFilteredQuery(Filter filter) {
        Query query = new Query().with(Sort.by(Sort.Direction.DESC, PUBLICATION_AT));
        List<Criteria> criteriaList = new ArrayList<>();

        criteriaList.add(Criteria.where(PUBLICATION_AT).gte(filter.getStartDate()).lte(filter.getEndDate()));

        if (Objects.nonNull(filter.getDepartment())) {
            criteriaList.add(Criteria.where("departments").is(filter.getDepartment()));
        }
        if (Objects.nonNull(filter.getProvince())) {
            criteriaList.add(Criteria.where("provinces").is(filter.getProvince()));
        }
        if (StringUtils.hasText(filter.getRisk())) {
            criteriaList.add(Criteria.where("riskLevel").is(filter.getRisk()));
        }
        if (StringUtils.hasText(filter.getEvent())) {
            criteriaList.add(Criteria.where("eventType.eventId").is(filter.getEvent()));
        }

        query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        return query;
    }
}
