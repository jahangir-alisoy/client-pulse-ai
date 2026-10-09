package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.entity.ApiKey;
import az.client_pulse_ai_backend.exception.ApiKeyUnavailableException;
import az.client_pulse_ai_backend.exception.InvalidApiKeyException;
import az.client_pulse_ai_backend.repository.ApiKeyRepository;
import az.client_pulse_ai_backend.security.SecretHasher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class ApiKeyAccessService {

	private static final String KEY_UNAVAILABLE_MESSAGE =
			"This API key no longer exists. Create or select another key to continue the simulation.";
	private static final String MISSING_KEY_MESSAGE = "Missing API key. Send your key in the X-API-Key header.";
	private static final String INVALID_KEY_MESSAGE = "The API key is invalid or has been revoked.";

	private final ApiKeyRepository apiKeyRepository;
	private final SecretHasher secretHasher;

	public AuthenticatedApiKey useOwnedKey(String username, Long apiKeyId) {
		return use(apiKeyRepository.findByIdAndOwnerUsername(apiKeyId, username)
				.orElseThrow(() -> new ApiKeyUnavailableException(KEY_UNAVAILABLE_MESSAGE)));
	}

	public AuthenticatedApiKey authenticate(String rawKey) {
		if (!StringUtils.hasText(rawKey)) {
			throw new InvalidApiKeyException(MISSING_KEY_MESSAGE);
		}
		return use(apiKeyRepository.findBySecretHash(secretHasher.hash(rawKey.strip()))
				.orElseThrow(() -> new InvalidApiKeyException(INVALID_KEY_MESSAGE)));
	}

	private AuthenticatedApiKey use(ApiKey apiKey) {
		apiKey.markUsed();
		return new AuthenticatedApiKey(apiKey.getOwner(), apiKey.maskedKey());
	}

}
