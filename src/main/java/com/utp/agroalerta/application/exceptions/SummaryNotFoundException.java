package com.utp.agroalerta.application.exceptions;

public class SummaryNotFoundException extends ResourceNotFoundException {
    public SummaryNotFoundException() {
        super("No se pudo calcular el resumen");
    }
}
