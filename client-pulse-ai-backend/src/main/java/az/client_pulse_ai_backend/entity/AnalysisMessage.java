package az.client_pulse_ai_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Embeddable
public record AnalysisMessage(
		@Enumerated(EnumType.STRING)
		@Column(nullable = false)
		ChatRole role,

		@Column(nullable = false, columnDefinition = "text")
		String content
) {
}
