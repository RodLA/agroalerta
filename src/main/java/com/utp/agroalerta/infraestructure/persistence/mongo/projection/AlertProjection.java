package com.utp.agroalerta.infraestructure.persistence.mongo.projection;

import java.util.List;

public interface AlertProjection {
    String getId();
    String getTitle();
    String getSummary();
    String getRisk();
    String getRiskDate();
    Event getEvent();
    List<Crop> getCrops();
    Source getSource();
    List<Department> getDepartments();

    interface Event {
        String getId();
        String getName();
    }

    interface Crop {
        String getId();
        String getName();
    }

    interface Source {
        String getSite();
    }

    interface Department {
        String getName();
    }
}
