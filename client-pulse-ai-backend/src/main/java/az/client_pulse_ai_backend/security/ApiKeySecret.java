package az.client_pulse_ai_backend.security;

public record ApiKeySecret(
		String rawKey,
		String prefix,
		String lastFour,
		String hash
) {
}
