package az.client_pulse_ai_backend.controller;

import az.client_pulse_ai_backend.dto.ApiKeyNameRequest;
import az.client_pulse_ai_backend.dto.ApiKeyResponse;
import az.client_pulse_ai_backend.dto.CreatedApiKeyResponse;
import az.client_pulse_ai_backend.service.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

	private final ApiKeyService apiKeyService;

	@GetMapping
	public List<ApiKeyResponse> findAll(Authentication authentication) {
		return apiKeyService.findAll(authentication.getName());
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public CreatedApiKeyResponse create(Authentication authentication, @Valid @RequestBody ApiKeyNameRequest request) {
		return apiKeyService.create(authentication.getName(), request.name());
	}

	@PutMapping("/{id}")
	public ApiKeyResponse rename(Authentication authentication, @PathVariable Long id,
			@Valid @RequestBody ApiKeyNameRequest request) {
		return apiKeyService.rename(authentication.getName(), id, request.name());
	}

	@PostMapping("/{id}/rotate")
	public CreatedApiKeyResponse rotate(Authentication authentication, @PathVariable Long id) {
		return apiKeyService.rotate(authentication.getName(), id);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(Authentication authentication, @PathVariable Long id) {
		apiKeyService.delete(authentication.getName(), id);
	}

}
