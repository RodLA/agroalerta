package com.utp.agroalerta.application.exceptions;

public class AlertNotFoundException extends ResourceNotFoundException {
    public AlertNotFoundException(String id) {
        super("Alerta con el id %s no encontrada".formatted(id));
    }
}
