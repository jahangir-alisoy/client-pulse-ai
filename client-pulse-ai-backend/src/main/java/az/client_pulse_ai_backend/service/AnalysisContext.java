package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.entity.Channel;
import az.client_pulse_ai_backend.entity.Customer;
import az.client_pulse_ai_backend.entity.SupportAgent;
import az.client_pulse_ai_backend.entity.User;

import java.util.UUID;

public record AnalysisContext(
		UUID sessionId,
		Channel channel,
		Customer customer,
		SupportAgent supportAgent,
		User owner,
		String apiKeyMasked
) {
}
