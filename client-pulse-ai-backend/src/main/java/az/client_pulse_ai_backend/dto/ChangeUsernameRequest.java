package az.client_pulse_ai_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangeUsernameRequest(
		@NotBlank
		@Size(min = 3, max = 50, message = "must be between {min} and {max} characters")
		@Pattern(regexp = "^[A-Za-z0-9._-]+$", message = "may contain only letters, digits, dots, underscores and hyphens")
		String newUsername,

		@NotBlank String currentPassword
) {

	public ChangeUsernameRequest {
		newUsername = newUsername == null ? null : newUsername.strip();
	}

}
