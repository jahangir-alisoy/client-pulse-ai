package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.Channel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record SimulationChatRequest(
		@NotNull UUID sessionId,
		@NotNull Channel channel,
		@NotNull Long customerId,
		@NotNull Long supportAgentId,
		@NotBlank String message,
		@NotNull List<@Valid ChatMessage> history,
		@NotNull Long apiKeyId
) {
}
