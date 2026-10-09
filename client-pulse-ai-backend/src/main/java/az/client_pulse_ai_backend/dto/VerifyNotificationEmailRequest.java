package az.client_pulse_ai_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyNotificationEmailRequest(
		@NotBlank @Pattern(regexp = "^\\d{6}$", message = "must be the 6-digit code from the email") String code
) {

	public VerifyNotificationEmailRequest {
		code = code == null ? null : code.strip();
	}

}
