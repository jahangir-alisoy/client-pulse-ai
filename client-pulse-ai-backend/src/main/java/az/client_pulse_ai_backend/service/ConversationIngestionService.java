package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.dto.IngestConversationRequest;
import az.client_pulse_ai_backend.dto.IngestConversationResponse;
import az.client_pulse_ai_backend.dto.IngestMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationIngestionService {

	private final ConversationAnalysisService conversationAnalysisService;
	private final CustomerService customerService;
	private final SupportAgentService supportAgentService;

	public IngestConversationResponse ingest(AuthenticatedApiKey apiKey, IngestConversationRequest request) {
		UUID sessionId = Optional.ofNullable(request.sessionId()).orElseGet(UUID::randomUUID);
		AnalysisContext context = new AnalysisContext(
				sessionId,
				request.channel(),
				Optional.ofNullable(request.customerId()).map(customerService::getById).orElse(null),
				Optional.ofNullable(request.supportAgentId()).map(supportAgentService::getById).orElse(null),
				apiKey.owner(),
				apiKey.maskedKey());
		conversationAnalysisService.analyze(context, request.messages().stream().map(IngestMessage::toChatMessage).toList());
		return IngestConversationResponse.accepted(sessionId);
	}

}
