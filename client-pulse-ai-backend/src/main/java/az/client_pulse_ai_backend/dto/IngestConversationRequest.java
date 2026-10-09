package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.Channel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record IngestConversationRequest(
		UUID sessionId,
		@NotNull Channel channel,
		Long customerId,
		Long supportAgentId,
		@NotNull @Size(min = 1, max = 200, message = "must contain between {min} and {max} messages") List<@NotNull @Valid IngestMessage> messages
) {
}
