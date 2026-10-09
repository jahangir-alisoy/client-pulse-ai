package az.client_pulse_ai_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "application.notifications")
public record NotificationProperties(
		@DefaultValue("20") int alertThreshold
) {
}
