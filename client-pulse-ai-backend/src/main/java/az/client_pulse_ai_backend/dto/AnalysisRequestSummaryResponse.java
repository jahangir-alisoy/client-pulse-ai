package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.AnalysisRequest;
import az.client_pulse_ai_backend.entity.AnalysisStatus;
import az.client_pulse_ai_backend.entity.Channel;

import java.time.Instant;
import java.util.UUID;

public record AnalysisRequestSummaryResponse(
		Long id,
		UUID sessionId,
		Channel channel,
		CustomerResponse customer,
		SupportAgentResponse supportAgent,
		AnalysisStatus status,
		Integer score,
		String description,
		String failureReason,
		Instant createdAt,
		Instant analyzedAt
) {

	public static AnalysisRequestSummaryResponse from(AnalysisRequest analysisRequest) {
		return new AnalysisRequestSummaryResponse(
				analysisRequest.getId(),
				analysisRequest.getSessionId(),
				analysisRequest.getChannel(),
				CustomerResponse.from(analysisRequest.getCustomer()),
				SupportAgentResponse.from(analysisRequest.getSupportAgent()),
				analysisRequest.getStatus(),
				analysisRequest.getScore(),
				analysisRequest.getDescription(),
				analysisRequest.getFailureReason(),
				analysisRequest.getCreatedAt(),
				analysisRequest.getAnalyzedAt()
		);
	}

}
