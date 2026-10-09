package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.ai.ConversationScore;
import az.client_pulse_ai_backend.ai.ConversationScorer;
import az.client_pulse_ai_backend.dto.ChatMessage;
import az.client_pulse_ai_backend.entity.AnalysisMessage;
import az.client_pulse_ai_backend.entity.AnalysisRequest;
import az.client_pulse_ai_backend.repository.AnalysisRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationAnalysisService {

	private final AnalysisRequestRepository analysisRequestRepository;
	private final ConversationScorer conversationScorer;

	@Async
	public void analyze(AnalysisContext context, List<ChatMessage> conversation) {
		AnalysisRequest analysisRequest = analysisRequestRepository.save(new AnalysisRequest(
				context.sessionId(),
				context.channel(),
				context.customer(),
				context.supportAgent(),
				toAnalysisMessages(conversation)));
		try {
			ConversationScore conversationScore = conversationScorer.score(conversation);
			analysisRequest.complete(conversationScore.score(), conversationScore.description());
		} catch (RuntimeException exception) {
			log.error("Analysis failed for request {}", analysisRequest.getId(), exception);
			analysisRequest.fail(exception.getMessage());
		}
		analysisRequestRepository.save(analysisRequest);
	}

	private List<AnalysisMessage> toAnalysisMessages(List<ChatMessage> conversation) {
		return conversation.stream()
				.map(message -> new AnalysisMessage(message.role(), message.content()))
				.toList();
	}

}
