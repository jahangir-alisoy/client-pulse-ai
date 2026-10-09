package az.client_pulse_ai_backend.ai;

import az.client_pulse_ai_backend.dto.ChatMessage;

import java.util.List;

public interface ConversationScorer {

	ConversationScore score(List<ChatMessage> conversation);

}
