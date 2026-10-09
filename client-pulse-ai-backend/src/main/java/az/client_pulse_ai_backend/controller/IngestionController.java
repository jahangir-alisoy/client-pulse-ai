package az.client_pulse_ai_backend.controller;

import az.client_pulse_ai_backend.dto.IngestConversationRequest;
import az.client_pulse_ai_backend.dto.IngestConversationResponse;
import az.client_pulse_ai_backend.security.ApiKeyAuthenticationArgumentResolver;
import az.client_pulse_ai_backend.service.AuthenticatedApiKey;
import az.client_pulse_ai_backend.service.ConversationIngestionService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ingest")
@RequiredArgsConstructor
public class IngestionController {

	private final ConversationIngestionService conversationIngestionService;

	@PostMapping("/conversations")
	@ResponseStatus(HttpStatus.ACCEPTED)
	@SecurityRequirements
	@Parameter(name = ApiKeyAuthenticationArgumentResolver.API_KEY_HEADER, in = ParameterIn.HEADER, required = true)
	public IngestConversationResponse ingest(@Parameter(hidden = true) AuthenticatedApiKey apiKey,
			@Valid @RequestBody IngestConversationRequest request) {
		return conversationIngestionService.ingest(apiKey, request);
	}

}
