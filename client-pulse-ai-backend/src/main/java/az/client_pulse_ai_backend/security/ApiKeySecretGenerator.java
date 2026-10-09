package az.client_pulse_ai_backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class ApiKeySecretGenerator {

	private static final String KEY_PREFIX = "cpk_";
	private static final int RANDOM_BYTE_COUNT = 32;
	private static final int VISIBLE_RANDOM_PREFIX_LENGTH = 4;
	private static final int VISIBLE_SUFFIX_LENGTH = 4;

	private final SecureRandom secureRandom = new SecureRandom();
	private final SecretHasher secretHasher;

	public ApiKeySecret generate() {
		byte[] randomBytes = new byte[RANDOM_BYTE_COUNT];
		secureRandom.nextBytes(randomBytes);
		String rawKey = KEY_PREFIX + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
		return new ApiKeySecret(
				rawKey,
				rawKey.substring(0, KEY_PREFIX.length() + VISIBLE_RANDOM_PREFIX_LENGTH),
				rawKey.substring(rawKey.length() - VISIBLE_SUFFIX_LENGTH),
				secretHasher.hash(rawKey));
	}

}
