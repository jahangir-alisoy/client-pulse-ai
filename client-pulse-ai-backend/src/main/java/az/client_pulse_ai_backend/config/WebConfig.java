package az.client_pulse_ai_backend.config;

import az.client_pulse_ai_backend.security.ApiKeyAuthenticationArgumentResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

	private final ApiKeyAuthenticationArgumentResolver apiKeyAuthenticationArgumentResolver;

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(apiKeyAuthenticationArgumentResolver);
	}

}
