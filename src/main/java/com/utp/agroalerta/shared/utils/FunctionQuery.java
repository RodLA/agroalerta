package com.utp.agroalerta.shared.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class FunctionQuery {

    private FunctionQuery() {
    }

    public static Map<String, Object> extractQueryParams(Message<Object> message) {
        // AWS Lambda environment: query parameters are in the payload
        if (message.getPayload() instanceof Map<?, ?> payloadMap) {
            Object queryParams = payloadMap.get("queryStringParameters");
            if (queryParams instanceof Map) {
                log.info("Extracting query params from AWS event payload.");
                return new HashMap<>((Map<String, String>) queryParams);
            }
        }

        // Local/Spring Cloud Function environment: query parameters are in headers
        Object headerParams = message.getHeaders().get("http_request_param");
        if (headerParams instanceof Map) {
            log.info("Extracting query params from message headers.");
            return (Map<String, Object>) headerParams;
        }

        log.warn("No query parameters found in message, returning empty map.");
        return Collections.emptyMap();
    }

}
