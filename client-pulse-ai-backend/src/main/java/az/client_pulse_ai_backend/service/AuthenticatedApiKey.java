package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.entity.User;

public record AuthenticatedApiKey(
		User owner,
		String maskedKey
) {
}
