package com.utp.agroalerta.model.alert;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class EventType {
    @Field("event_id")
    private String eventId;
    @Field("event_name")
    private String eventName;
}
