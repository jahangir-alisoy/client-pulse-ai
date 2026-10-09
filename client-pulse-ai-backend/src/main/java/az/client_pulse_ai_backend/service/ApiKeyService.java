package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.dto.ApiKeyResponse;
import az.client_pulse_ai_backend.dto.CreatedApiKeyResponse;
import az.client_pulse_ai_backend.entity.ApiKey;
import az.client_pulse_ai_backend.entity.User;
import az.client_pulse_ai_backend.exception.ConflictException;
import az.client_pulse_ai_backend.exception.ResourceNotFoundException;
import az.client_pulse_ai_backend.repository.ApiKeyRepository;
import az.client_pulse_ai_backend.security.ApiKeySecret;
import az.client_pulse_ai_backend.security.ApiKeySecretGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApiKeyService {

	private static final int MAX_KEYS_PER_USER = 5;
	private static final String DEFAULT_KEY_NAME = "Default key";

	private final ApiKeyRepository apiKeyRepository;
	private final UserService userService;
	private final ApiKeySecretGenerator apiKeySecretGenerator;

	public void provisionDefaultKey(String username) {
		User user = userService.getLockedByUsername(username);
		if (!user.isApiKeyProvisioned()) {
			apiKeyRepository.save(new ApiKey(user, DEFAULT_KEY_NAME, apiKeySecretGenerator.generate()));
			user.markApiKeyProvisioned();
		}
	}

	public List<ApiKeyResponse> findAll(String username) {
		provisionDefaultKey(username);
		return apiKeyRepository.findAllByOwnerUsernameOrderByCreatedAtDescIdDesc(username).stream()
				.map(ApiKeyResponse::from)
				.toList();
	}

	public CreatedApiKeyResponse create(String username, String name) {
		User user = userService.getLockedByUsername(username);
		if (apiKeyRepository.countByOwnerId(user.getId()) >= MAX_KEYS_PER_USER) {
			throw new ConflictException("You can have at most " + MAX_KEYS_PER_USER + " API keys.");
		}
		ApiKeySecret secret = apiKeySecretGenerator.generate();
		ApiKey apiKey = apiKeyRepository.save(new ApiKey(user, name, secret));
		user.markApiKeyProvisioned();
		return new CreatedApiKeyResponse(ApiKeyResponse.from(apiKey), secret.rawKey());
	}

	public ApiKeyResponse rename(String username, Long id, String name) {
		ApiKey apiKey = getOwnedKey(username, id);
		apiKey.rename(name);
		return ApiKeyResponse.from(apiKey);
	}

	public CreatedApiKeyResponse rotate(String username, Long id) {
		ApiKey apiKey = getOwnedKey(username, id);
		ApiKeySecret secret = apiKeySecretGenerator.generate();
		apiKey.rotate(secret);
		return new CreatedApiKeyResponse(ApiKeyResponse.from(apiKey), secret.rawKey());
	}

	public void delete(String username, Long id) {
		apiKeyRepository.delete(getOwnedKey(username, id));
	}

	private ApiKey getOwnedKey(String username, Long id) {
		return apiKeyRepository.findByIdAndOwnerUsername(id, username)
				.orElseThrow(() -> new ResourceNotFoundException("API key not found: " + id));
	}

}
