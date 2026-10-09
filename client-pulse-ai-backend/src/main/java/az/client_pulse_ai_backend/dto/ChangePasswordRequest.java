package az.client_pulse_ai_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
		@NotBlank String currentPassword,
		@NotBlank @Size(min = 8, max = 128, message = "must be between {min} and {max} characters") String newPassword
) {
}
