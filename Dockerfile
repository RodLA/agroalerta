# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Package stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/utp-component-agroalerta-api-1.0.0.jar .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "utp-component-agroalerta-api-1.0.0.jar"]
