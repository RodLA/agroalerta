package com.utp.agroalerta.application.exceptions;

public class ReportNotFoundException extends ResourceNotFoundException {
    public ReportNotFoundException() {
        super("No se pudo calcular el reporte");
    }
}
