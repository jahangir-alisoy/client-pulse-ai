package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.config.NotificationProperties;
import az.client_pulse_ai_backend.dto.VerificationSentResponse;
import az.client_pulse_ai_backend.entity.NotificationSettings;
import az.client_pulse_ai_backend.entity.User;
import az.client_pulse_ai_backend.exception.BadRequestException;
import az.client_pulse_ai_backend.exception.TooManyRequestsException;
import az.client_pulse_ai_backend.mail.EmailSender;
import az.client_pulse_ai_backend.repository.NotificationSettingsRepository;
import az.client_pulse_ai_backend.security.SecretHasher;
import az.client_pulse_ai_backend.security.VerificationCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationEmailService {

	private static final Duration CODE_VALIDITY = Duration.ofMinutes(10);
	private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);
	private static final int MAX_FAILED_ATTEMPTS = 5;
	private static final String VERIFICATION_SUBJECT = "Your Client Pulse AI verification code";

	private final UserService userService;
	private final NotificationSettingsRepository notificationSettingsRepository;
	private final VerificationCodeGenerator verificationCodeGenerator;
	private final SecretHasher secretHasher;
	private final EmailSender emailSender;
	private final NotificationProperties notificationProperties;

	public VerificationSentResponse sendVerificationCode(String username, String email) {
		NotificationSettings settings = findOrCreateSettings(username);
		Instant now = Instant.now();
		if (settings.isCodeResendBlocked(now, RESEND_COOLDOWN)) {
			throw new TooManyRequestsException("Please wait before requesting another code.");
		}
		String code = verificationCodeGenerator.generate();
		Instant expiresAt = now.plus(CODE_VALIDITY);
		settings.startVerification(email, secretHasher.hash(code), now, expiresAt);
		emailSender.send(email, VERIFICATION_SUBJECT, verificationBody(code));
		return new VerificationSentResponse(email, expiresAt, emailSender.delivery());
	}

	@Transactional(noRollbackFor = BadRequestException.class)
	public void verify(String username, String code) {
		NotificationSettings settings = findSettings(username)
				.filter(NotificationSettings::hasPendingEmail)
				.orElseThrow(() -> new BadRequestException("There is no email address waiting for verification."));
		if (!settings.hasPendingCode()) {
			throw new BadRequestException("There is no active verification code. Request a new code.");
		}
		if (settings.isPendingCodeExpired(Instant.now())) {
			throw new BadRequestException("The verification code has expired. Request a new code.");
		}
		if (!secretHasher.matches(code, settings.getPendingCodeHash())) {
			rejectIncorrectCode(settings);
		}
		settings.confirmPendingEmail();
	}

	public void changeAlertsEnabled(String username, boolean enabled) {
		Optional<NotificationSettings> settings = findSettings(username);
		if (enabled && settings.filter(NotificationSettings::hasVerifiedEmail).isEmpty()) {
			throw new BadRequestException("Verify a notification email before enabling alerts.");
		}
		settings.ifPresent(notificationSettings -> notificationSettings.changeAlertsEnabled(enabled));
	}

	public void removeEmail(String username) {
		findSettings(username).ifPresent(NotificationSettings::removeEmails);
	}

	private void rejectIncorrectCode(NotificationSettings settings) {
		int remainingAttempts = MAX_FAILED_ATTEMPTS - settings.recordFailedVerificationAttempt();
		if (remainingAttempts <= 0) {
			settings.invalidatePendingCode();
			throw new BadRequestException("Too many incorrect attempts. Request a new code.");
		}
		throw new BadRequestException("The verification code is incorrect. "
				+ remainingAttempts + (remainingAttempts == 1 ? " attempt" : " attempts") + " left.");
	}

	private Optional<NotificationSettings> findSettings(String username) {
		return notificationSettingsRepository.findByUserId(userService.getLockedByUsername(username).getId());
	}

	private NotificationSettings findOrCreateSettings(String username) {
		User user = userService.getLockedByUsername(username);
		return notificationSettingsRepository.findByUserId(user.getId())
				.orElseGet(() -> notificationSettingsRepository.save(new NotificationSettings(user)));
	}

	private String verificationBody(String code) {
		return """
				Your Client Pulse AI verification code is %s.

				Enter this code in Settings to receive an email whenever a conversation scores below %d. \
				The code expires in %d minutes.

				If you did not request this code, you can safely ignore this email.
				""".formatted(code, notificationProperties.alertThreshold(), CODE_VALIDITY.toMinutes());
	}

}
