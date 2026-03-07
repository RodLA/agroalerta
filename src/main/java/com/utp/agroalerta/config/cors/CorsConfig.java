package com.utp.agroalerta.config.cors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${app.cors.origin}")
    private String origin;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        // setAllowedOriginPatterns te permite usar comodines (*)
        config.setAllowedOriginPatterns(Arrays.asList(
                origin, // Tu dominio principal (el que tienes en la variable de AWS)
                "https://*-andersonle17s-projects.vercel.app", // Dominios dinámicos de Vercel
                "http://localhost:3000" // Tu entorno local
        ));

        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}