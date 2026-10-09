package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.ChatRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChatMessage(
		@NotNull ChatRole role,
		@NotBlank String content
) {
}
