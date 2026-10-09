package az.client_pulse_ai_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "application.security.jwt")
public record JwtProperties(
		String secretKey,
		TokenProperties accessToken,
		TokenProperties refreshToken
) {

	public record TokenProperties(long expiration) {
	}

}
