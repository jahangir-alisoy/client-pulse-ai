package az.client_pulse_ai_backend.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Component
public class SecretHasher {

	private static final String ALGORITHM = "SHA-256";

	public String hash(String secret) {
		return HexFormat.of().formatHex(digest(secret));
	}

	public boolean matches(String secret, String expectedHash) {
		return expectedHash != null && MessageDigest.isEqual(
				hash(secret).getBytes(StandardCharsets.US_ASCII),
				expectedHash.getBytes(StandardCharsets.US_ASCII));
	}

	private byte[] digest(String secret) {
		try {
			return MessageDigest.getInstance(ALGORITHM).digest(secret.getBytes(StandardCharsets.UTF_8));
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException(ALGORITHM + " is not available", exception);
		}
	}

}
