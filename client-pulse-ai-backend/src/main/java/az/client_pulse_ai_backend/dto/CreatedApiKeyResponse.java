package az.client_pulse_ai_backend.dto;

public record CreatedApiKeyResponse(
		ApiKeyResponse apiKey,
		String secret
) {
}
