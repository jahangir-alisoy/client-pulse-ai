package az.client_pulse_ai_backend.ai;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

public record ConversationScore(
		@JsonPropertyDescription("Client satisfaction score from 0 (very dissatisfied) to 100 (very satisfied)")
		int score,

		@JsonPropertyDescription("Short explanation of why this score was given")
		String description
) {
}
