package com.example.subscriptii_api;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SubscriptiiApiApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
    void testSubscriptionPrice() {
        // Creăm obiectul - acum Java îl va găsi pentru că e în același pachet
        Subscription sub = new Subscription();
        
        sub.setPrice(50.0);
        
        assertEquals(50.0, sub.getPrice(), "Prețul ar trebui să fie 50.0");
    }

    @Test
    void testSubscriptionName() {
        Subscription sub = new Subscription();
        sub.setName("Netflix");
        assertEquals("Netflix", sub.getName());
    }

}
