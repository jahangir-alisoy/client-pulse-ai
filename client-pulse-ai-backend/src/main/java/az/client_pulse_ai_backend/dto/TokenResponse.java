package az.client_pulse_ai_backend.dto;

public record TokenResponse(
		String accessToken,
		String refreshToken
) {
}
