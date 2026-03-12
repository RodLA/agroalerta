package com.utp.agroalerta;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.TimeZone;
import java.util.function.Supplier;

@SpringBootApplication
public class UtpComponentAgroalertaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(UtpComponentAgroalertaApiApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
    }

    @Bean(name = "health")
    public Supplier<String> health() {
        return () -> "Ok";
    }

}
