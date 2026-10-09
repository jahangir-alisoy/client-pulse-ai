package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.AnalysisStatus;

public record StatusCount(
		AnalysisStatus status,
		Long count
) {
}
