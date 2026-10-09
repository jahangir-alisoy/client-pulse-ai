package az.client_pulse_ai_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
		@NotBlank String refreshToken
) {
}
