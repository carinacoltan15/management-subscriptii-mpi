FROM maven:3.8-openjdk-17-slim  
WORKDIR /app  
COPY pom.xml .  
COPY src ./src  
RUN mvn package -DskipTests  
EXPOSE 8080  
CMD ["java", "-jar", "target/*.jar"] 
