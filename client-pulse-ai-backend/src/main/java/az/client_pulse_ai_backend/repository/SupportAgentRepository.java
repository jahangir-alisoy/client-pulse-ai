package az.client_pulse_ai_backend.repository;

import az.client_pulse_ai_backend.entity.SupportAgent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportAgentRepository extends JpaRepository<SupportAgent, Long> {
}
