package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.mail.EmailDelivery;

import java.time.Instant;

public record VerificationSentResponse(
		String pendingNotificationEmail,
		Instant expiresAt,
		EmailDelivery emailDelivery
) {
}
