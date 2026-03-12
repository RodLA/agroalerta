package com.utp.agroalerta.infraestructure.config;

import com.utp.agroalerta.application.services.AlertService;
import com.utp.agroalerta.application.services.LocationService;
import com.utp.agroalerta.application.services.ReportService;
import com.utp.agroalerta.application.services.SummaryService;
import com.utp.agroalerta.domain.ports.in.RetrieveAlertsUseCase;
import com.utp.agroalerta.domain.ports.in.RetrieveLocationsUseCase;
import com.utp.agroalerta.domain.ports.in.RetrieveReportUseCase;
import com.utp.agroalerta.domain.ports.in.RetrieveSummaryUseCase;
import com.utp.agroalerta.domain.ports.out.AlertRepositoryPort;
import com.utp.agroalerta.domain.ports.out.LocationRepositoryPort;
import com.utp.agroalerta.domain.ports.out.ReportRepositoryPort;
import com.utp.agroalerta.domain.ports.out.SummaryRepositoryPort;
import com.utp.agroalerta.infraestructure.adapters.out.AlertMongoAdapter;
import com.utp.agroalerta.infraestructure.adapters.out.LocationMongoAdapter;
import com.utp.agroalerta.infraestructure.adapters.out.ReportMongoAdapter;
import com.utp.agroalerta.infraestructure.adapters.out.SummaryMongoAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class ApplicationConfig {

    @Bean
    public AlertRepositoryPort alertRepositoryPort(AlertMongoAdapter alertMongoAdapter) {
        return alertMongoAdapter;
    }

    @Bean
    public RetrieveAlertsUseCase retrieveAlertsUseCase(AlertRepositoryPort alertRepositoryPort) {
        return new AlertService(alertRepositoryPort);
    }

    @Bean
    public LocationRepositoryPort locationRepositoryPort(LocationMongoAdapter locationMongoAdapter) {
        return locationMongoAdapter;
    }

    @Bean
    public RetrieveLocationsUseCase retrieveLocationsUseCase(LocationRepositoryPort locationRepositoryPort) {
        return new LocationService(locationRepositoryPort);
    }

    @Bean
    public SummaryRepositoryPort summaryRepositoryPort(SummaryMongoAdapter summaryMongoAdapter) {
        return summaryMongoAdapter;
    }

    @Bean
    public RetrieveSummaryUseCase retrieveSummaryUseCase(SummaryRepositoryPort summaryRepositoryPort) {
        return new SummaryService(summaryRepositoryPort);
    }

    @Bean
    public ReportRepositoryPort reportRepositoryPort(ReportMongoAdapter reportMongoAdapter) {
        return reportMongoAdapter;
    }

    @Bean
    public RetrieveReportUseCase retrieveReportUseCase(ReportRepositoryPort reportRepositoryPort) {
        return new ReportService(reportRepositoryPort);
    }
}
