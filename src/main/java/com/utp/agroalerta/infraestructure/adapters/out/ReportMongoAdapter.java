package com.utp.agroalerta.infraestructure.adapters.out;

import com.utp.agroalerta.domain.criteria.SearchCriteria;
import com.utp.agroalerta.domain.model.report.Report;
import com.utp.agroalerta.domain.ports.out.ReportRepositoryPort;
import com.utp.agroalerta.infraestructure.persistence.mongo.mapper.ReportMongoMapper;
import com.utp.agroalerta.infraestructure.persistence.mongo.view.ReportView;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Component;

import java.time.YearMonth;
import java.util.Objects;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ReportMongoAdapter implements ReportRepositoryPort {

    private final MongoTemplate mongoTemplate;
    private final ReportMongoMapper reportMongoMapper;

    @Override
    public Optional<Report> getReport(SearchCriteria criteria) {
        Aggregation aggregation = Aggregation.newAggregation(
                buildMatchStage(criteria.getStart(), criteria.getEnd(), criteria.getDepartment()),
                buildFacetStage(criteria.getDepartment()),
                buildProjectStage()
        );

        ReportView reportView = mongoTemplate.aggregate(aggregation, "documents_risk_alerts", ReportView.class)
                .getUniqueMappedResult();

        return Optional.ofNullable(reportMongoMapper.toDomain(Objects.requireNonNull(reportView)));
    }

    private AggregationOperation buildMatchStage(String startDate, String endDate, Integer departmentId) {
        String effectiveStartDate = (startDate != null && !startDate.isBlank())
                ? startDate
                : YearMonth.now().toString();

        Criteria criteria = Criteria.where("risk_date").gte(effectiveStartDate);

        if (endDate != null && !endDate.isBlank()) {
            criteria.lte(endDate);
        }

        if (departmentId != null) {
            criteria.and("department_ids").is(departmentId);
        }

        return Aggregation.match(criteria);
    }

    private AggregationOperation buildFacetStage(Integer departmentId) {
        String targetLocationsExpression;

        if (departmentId != null) {
            // Expresión de MongoDB para filtrar el departamento exacto y extraer los IDs de sus provincias
            targetLocationsExpression = String.format("""
            {
              $let: {
                vars: {
                  dept: {
                    $first: {
                      $filter: {
                        input: { $ifNull: ["$departments", []] },
                        as: "d",
                        cond: { $eq: ["$$d.id", %d] }
                      }
                    }
                  }
                },
                in: { $ifNull: ["$$dept.provinces.id", []] }
              }
            }
            """, departmentId);
        } else {
            // Comportamiento por defecto: tomar todos los departamentos
            targetLocationsExpression = "\"$department_ids\"";
        }

        String facetJson = String.format("""
        {
          $facet: {
            "sources": [
              { $group: { _id: { site: "$source.site", site_name: "$source.site_name" }, count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $replaceRoot: { newRoot: "$_id" } }
            ],
            "crops": [
              { $unwind: "$crops" },
              { $group: { _id: { id: "$crops.id", name: "$crops.name" }, count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $replaceRoot: { newRoot: "$_id" } }
            ],
            "levels": [
              { $group: { _id: "$risk" } }
            ],
            "locations": [
              { $unwind: "$crops" },
              { $addFields: { target_locations: %s } },
              { $unwind: "$target_locations" },
              { $group: { _id: { crop_id: "$crops.id", location_id: "$target_locations", risk: "$risk" }, count: { $sum: 1 } } },
              { $group: { _id: "$_id.crop_id", data: { $push: { id: "$_id.location_id", risk: "$_id.risk", count: "$count" } } } },
              { $project: { _id: 0, k: "$_id", v: "$data" } }
            ]
          }
        }
        """, targetLocationsExpression);

        return context -> Document.parse(facetJson);
    }

    private AggregationOperation buildProjectStage() {
        String projectJson = """
                {
                  $project: {
                    sources: 1,
                    crops: 1,
                    levels: { $map: { input: "$levels", as: "lvl", in: "$$lvl._id" } },
                    locations: { $arrayToObject: "$locations" }
                  }
                }
                """;

        return context -> Document.parse(projectJson);
    }
}
