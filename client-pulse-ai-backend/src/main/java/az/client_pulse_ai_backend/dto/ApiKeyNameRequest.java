package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.ApiKey;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ApiKeyNameRequest(
		@NotBlank @Size(max = ApiKey.MAX_NAME_LENGTH, message = "must be at most {max} characters") String name
) {

	public ApiKeyNameRequest {
		name = name == null ? null : name.strip();
	}

}
