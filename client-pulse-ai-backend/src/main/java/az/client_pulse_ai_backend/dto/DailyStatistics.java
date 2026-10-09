package az.client_pulse_ai_backend.dto;

import java.time.LocalDate;

public record DailyStatistics(
		LocalDate date,
		Long requestCount,
		Double averageScore
) {
}
