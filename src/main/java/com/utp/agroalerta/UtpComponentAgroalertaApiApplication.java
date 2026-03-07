package com.utp.agroalerta;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class UtpComponentAgroalertaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(UtpComponentAgroalertaApiApplication.class, args);
    }

    @PostConstruct
    public void init() {
        // Establece la zona horaria de Perú para toda la aplicación
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
    }

}
