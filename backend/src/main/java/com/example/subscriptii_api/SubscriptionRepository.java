package com.example.subscriptii_api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    // Asta e tot! Spring Boot va genera automat metodele de Save, Find, Delete.
}