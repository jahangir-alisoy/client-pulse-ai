package az.client_pulse_ai_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NotificationEmailRequest(
		@NotBlank @Email @Size(max = 254) String email
) {

	public NotificationEmailRequest {
		email = email == null ? null : email.strip();
	}

}
