package az.client_pulse_ai_backend.config;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class AnthropicConfig {

	@Bean
	public AnthropicClient anthropicClient(AiProperties aiProperties) {
		if (!StringUtils.hasText(aiProperties.apiKey())) {
			throw new IllegalStateException("application.ai.api-key is not set. Provide it via the ANTHROPIC_API_KEY environment variable.");
		}
		return AnthropicOkHttpClient.builder()
				.fromEnv()
				.apiKey(aiProperties.apiKey())
				.build();
	}

}
