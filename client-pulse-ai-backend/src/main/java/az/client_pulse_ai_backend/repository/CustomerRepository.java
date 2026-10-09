package az.client_pulse_ai_backend.repository;

import az.client_pulse_ai_backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
