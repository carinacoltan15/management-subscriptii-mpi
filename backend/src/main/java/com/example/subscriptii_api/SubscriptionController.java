package com.example.subscriptii_api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*") 
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository repository;

    @GetMapping
    public List<Subscription> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Subscription create(@RequestBody Subscription sub) {
        return repository.save(sub);
    }
}