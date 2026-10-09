package az.client_pulse_ai_backend.dto;

import jakarta.validation.constraints.NotNull;

public record NotificationPreferencesRequest(
		@NotNull Boolean enabled
) {
}
