package az.client_pulse_ai_backend.security;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class VerificationCodeGenerator {

	private static final int CODE_BOUND = 1_000_000;
	private static final String CODE_FORMAT = "%06d";

	private final SecureRandom secureRandom = new SecureRandom();

	public String generate() {
		return CODE_FORMAT.formatted(secureRandom.nextInt(CODE_BOUND));
	}

}
