package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.ai.Chatbot;
import az.client_pulse_ai_backend.dto.ChatMessage;
import az.client_pulse_ai_backend.dto.SimulationChatRequest;
import az.client_pulse_ai_backend.dto.SimulationChatResponse;
import az.client_pulse_ai_backend.entity.ChatRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class SimulationService {

	private final Chatbot chatbot;
	private final ConversationAnalysisService conversationAnalysisService;

	public SimulationChatResponse chat(SimulationChatRequest request) {
		List<ChatMessage> conversation = append(request.history(), new ChatMessage(ChatRole.USER, request.message()));
		String reply = chatbot.reply(conversation);
		conversationAnalysisService.analyze(request.sessionId(), append(conversation, new ChatMessage(ChatRole.ASSISTANT, reply)));
		return new SimulationChatResponse(reply);
	}

	private List<ChatMessage> append(List<ChatMessage> messages, ChatMessage message) {
		return Stream.concat(messages.stream(), Stream.of(message)).toList();
	}

}
