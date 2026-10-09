FROM eclipse-temurin:26-jdk AS build
WORKDIR /app
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
RUN sh ./gradlew --no-daemon dependencies > /dev/null
COPY src src
RUN sh ./gradlew --no-daemon bootJar -x test && cp build/libs/*.jar app.jar

FROM eclipse-temurin:26-jre
WORKDIR /app
RUN useradd --system --uid 1001 app
COPY --from=build /app/app.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]