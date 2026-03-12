package com.utp.agroalerta.domain.model.alert;

import lombok.Getter;

@Getter
public enum RiskLevel {
    MUY_ALTO("MUY ALTO"),
    ALTO("ALTO"),
    MEDIO("MEDIO"),
    BAJO("BAJO"),
    MUY_BAJO("MUY BAJO");

    private final String label;

    RiskLevel(String label) {
        this.label = label;
    }

    public static RiskLevel fromLabel(String label) {
        for (RiskLevel level : RiskLevel.values()) {
            if (level.getLabel().equalsIgnoreCase(label)) {
                return level;
            }
        }
        throw new IllegalArgumentException("Unknown risk level: " + label);
    }


}
