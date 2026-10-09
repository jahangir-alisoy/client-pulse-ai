package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.ChatRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IngestMessage(
		@NotNull ChatRole role,
		@NotBlank @Size(max = 10000, message = "must be at most {max} characters") String content
) {

	public ChatMessage toChatMessage() {
		return new ChatMessage(role, content);
	}

}
