package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.AnalysisRequest;
import az.client_pulse_ai_backend.entity.AnalysisStatus;
import az.client_pulse_ai_backend.entity.Channel;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AnalysisRequestDetailResponse(
		Long id,
		UUID sessionId,
		Channel channel,
		CustomerResponse customer,
		SupportAgentResponse supportAgent,
		String apiKeyMasked,
		AnalysisStatus status,
		Integer score,
		String description,
		String failureReason,
		List<ChatMessage> messages,
		Instant createdAt,
		Instant analyzedAt
) {

	public static AnalysisRequestDetailResponse from(AnalysisRequest analysisRequest) {
		return new AnalysisRequestDetailResponse(
				analysisRequest.getId(),
				analysisRequest.getSessionId(),
				analysisRequest.getChannel(),
				CustomerResponse.from(analysisRequest.getCustomer()),
				SupportAgentResponse.from(analysisRequest.getSupportAgent()),
				analysisRequest.getApiKeyMasked(),
				analysisRequest.getStatus(),
				analysisRequest.getScore(),
				analysisRequest.getDescription(),
				analysisRequest.getFailureReason(),
				analysisRequest.getMessages().stream()
						.map(message -> new ChatMessage(message.role(), message.content()))
						.toList(),
				analysisRequest.getCreatedAt(),
				analysisRequest.getAnalyzedAt()
		);
	}

}
