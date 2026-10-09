package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.ApiKey;

import java.time.Instant;

public record ApiKeyResponse(
		Long id,
		String name,
		String maskedKey,
		Instant createdAt,
		Instant rotatedAt,
		Instant lastUsedAt
) {

	public static ApiKeyResponse from(ApiKey apiKey) {
		return new ApiKeyResponse(
				apiKey.getId(),
				apiKey.getName(),
				apiKey.maskedKey(),
				apiKey.getCreatedAt(),
				apiKey.getRotatedAt(),
				apiKey.getLastUsedAt()
		);
	}

}
