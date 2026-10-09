package az.client_pulse_ai_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "application.mail")
public record MailServerProperties(
		String host,
		@DefaultValue("587") int port,
		String username,
		String password,
		String from,
		@DefaultValue("true") boolean starttls
) {
}
