package az.client_pulse_ai_backend.ai;

import az.client_pulse_ai_backend.config.AiProperties;
import az.client_pulse_ai_backend.dto.ChatMessage;
import com.anthropic.client.AnthropicClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.OutputConfig;
import com.anthropic.models.messages.StopReason;
import com.anthropic.models.messages.StructuredMessage;
import com.anthropic.models.messages.StructuredMessageCreateParams;
import com.anthropic.models.messages.StructuredTextBlock;
import com.anthropic.models.messages.TextBlock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ClaudeAiClient implements Chatbot, ConversationScorer {

	private static final long MAX_TOKENS = 16000L;
	private static final String FALLBACK_BETA = "server-side-fallback-2026-07-01";

	private final AnthropicClient anthropicClient;
	private final AiProperties aiProperties;

	@Override
	public String reply(List<ChatMessage> conversation) {
		MessageCreateParams.Builder builder = baseParams(aiProperties.chatbotPrompt())
				.outputConfig(OutputConfig.builder().effort(OutputConfig.Effort.LOW).build());
		conversation.forEach(message -> addMessage(builder, message));

		Message response = anthropicClient.messages().create(builder.build());
		requireNotRefused(response.stopReason());
		return response.content().stream()
				.flatMap(block -> block.text().stream())
				.map(TextBlock::text)
				.collect(Collectors.joining());
	}

	@Override
	public ConversationScore score(List<ChatMessage> conversation) {
		StructuredMessageCreateParams<ConversationScore> params = baseParams(aiProperties.scoringPrompt())
				.outputConfig(ConversationScore.class)
				.addUserMessage(toTranscript(conversation))
				.build();

		StructuredMessage<ConversationScore> response = anthropicClient.messages().create(params);
		requireNotRefused(response.stopReason());
		return response.content().stream()
				.flatMap(block -> block.text().stream())
				.map(StructuredTextBlock::text)
				.findFirst()
				.orElseThrow(() -> new AiResponseException("AI returned no score"));
	}

	private MessageCreateParams.Builder baseParams(String systemPrompt) {
		return MessageCreateParams.builder()
				.model(aiProperties.model())
				.maxTokens(MAX_TOKENS)
				.system(systemPrompt)
				.putAdditionalHeader("anthropic-beta", FALLBACK_BETA)
				.putAdditionalBodyProperty("fallbacks", JsonValue.from("default"));
	}

	private void addMessage(MessageCreateParams.Builder builder, ChatMessage message) {
		switch (message.role()) {
			case USER -> builder.addUserMessage(message.content());
			case ASSISTANT -> builder.addAssistantMessage(message.content());
		}
	}

	private String toTranscript(List<ChatMessage> conversation) {
		return conversation.stream()
				.map(message -> message.role() + ": " + message.content())
				.collect(Collectors.joining("\n", "<conversation>\n", "\n</conversation>"));
	}

	private void requireNotRefused(Optional<StopReason> stopReason) {
		if (stopReason.filter(StopReason.REFUSAL::equals).isPresent()) {
			throw new AiResponseException("AI refused to respond");
		}
	}

}
