package com.utp.agroalerta.dto;

public record AlertGroupKey(
        String cropId,
        Integer locationId,
        String riskLevel
) {
}
