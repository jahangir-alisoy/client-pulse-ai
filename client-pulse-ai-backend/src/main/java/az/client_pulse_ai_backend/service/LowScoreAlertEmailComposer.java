package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.config.FrontendProperties;
import az.client_pulse_ai_backend.config.NotificationProperties;
import az.client_pulse_ai_backend.entity.AnalysisRequest;
import az.client_pulse_ai_backend.entity.Channel;
import az.client_pulse_ai_backend.entity.Customer;
import az.client_pulse_ai_backend.entity.SupportAgent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LowScoreAlertEmailComposer {

	private static final DateTimeFormatter RECEIVED_AT_FORMAT =
			DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm 'UTC'").withZone(ZoneOffset.UTC);
	private static final String NO_DESCRIPTION = "No description was provided.";

	private final FrontendProperties frontendProperties;
	private final NotificationProperties notificationProperties;

	public LowScoreAlertEmail compose(AnalysisRequest analysisRequest) {
		return new LowScoreAlertEmail(subject(analysisRequest), body(analysisRequest));
	}

	private String subject(AnalysisRequest analysisRequest) {
		return "Client Pulse AI alert: satisfaction score " + analysisRequest.getScore() + "/100";
	}

	private String body(AnalysisRequest analysisRequest) {
		List<String> lines = new ArrayList<>();
		lines.add("A conversation scored below your alert threshold of " + notificationProperties.alertThreshold() + ".");
		lines.add("");
		lines.add("Score: " + analysisRequest.getScore() + "/100");
		lines.add("AI summary: " + Optional.ofNullable(analysisRequest.getDescription()).orElse(NO_DESCRIPTION));
		lines.add("Channel: " + displayName(analysisRequest.getChannel()));
		Optional.ofNullable(analysisRequest.getCustomer()).map(this::describe)
				.ifPresent(customer -> lines.add("Customer: " + customer));
		Optional.ofNullable(analysisRequest.getSupportAgent()).map(SupportAgent::getFullName)
				.ifPresent(supportAgent -> lines.add("Support assistant: " + supportAgent));
		lines.add("Received: " + RECEIVED_AT_FORMAT.format(receivedAt(analysisRequest)));
		lines.add("");
		lines.add("Open the conversation: " + frontendProperties.linkTo("/requests/" + analysisRequest.getId()));
		lines.add("");
		lines.add("You receive this email because low-score alerts are enabled in your Client Pulse AI settings.");
		return String.join("\n", lines);
	}

	private String describe(Customer customer) {
		return customer.getFullName() + " (" + customer.getCustomerNumber() + ")";
	}

	private String displayName(Channel channel) {
		String name = channel.name().toLowerCase(Locale.ROOT);
		return Character.toUpperCase(name.charAt(0)) + name.substring(1);
	}

	private Instant receivedAt(AnalysisRequest analysisRequest) {
		return Optional.ofNullable(analysisRequest.getCreatedAt()).orElseGet(Instant::now);
	}

}
