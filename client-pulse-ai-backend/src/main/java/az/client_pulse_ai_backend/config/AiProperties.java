package az.client_pulse_ai_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "application.ai")
public record AiProperties(
		String apiKey,
		String model,
		String chatbotPrompt,
		String scoringPrompt
) {
}
