package az.client_pulse_ai_backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record SimulationChatRequest(
		@NotNull UUID sessionId,
		@NotBlank String message,
		@NotNull List<@Valid ChatMessage> history
) {
}
