package az.client_pulse_ai_backend.repository;

import az.client_pulse_ai_backend.entity.NotificationSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, Long> {

	Optional<NotificationSettings> findByUserId(Long userId);

}
