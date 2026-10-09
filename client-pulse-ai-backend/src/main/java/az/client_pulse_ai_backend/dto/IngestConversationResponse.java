package az.client_pulse_ai_backend.dto;

import java.util.UUID;

public record IngestConversationResponse(
		UUID sessionId,
		String status
) {

	private static final String ACCEPTED = "ACCEPTED";

	public static IngestConversationResponse accepted(UUID sessionId) {
		return new IngestConversationResponse(sessionId, ACCEPTED);
	}

}
