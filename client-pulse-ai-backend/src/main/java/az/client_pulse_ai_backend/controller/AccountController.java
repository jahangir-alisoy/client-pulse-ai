package az.client_pulse_ai_backend.controller;

import az.client_pulse_ai_backend.dto.AccountResponse;
import az.client_pulse_ai_backend.dto.ChangePasswordRequest;
import az.client_pulse_ai_backend.dto.ChangeUsernameRequest;
import az.client_pulse_ai_backend.dto.NotificationEmailRequest;
import az.client_pulse_ai_backend.dto.NotificationPreferencesRequest;
import az.client_pulse_ai_backend.dto.TokenResponse;
import az.client_pulse_ai_backend.dto.VerificationSentResponse;
import az.client_pulse_ai_backend.dto.VerifyNotificationEmailRequest;
import az.client_pulse_ai_backend.service.AccountService;
import az.client_pulse_ai_backend.service.NotificationEmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/account")
@RequiredArgsConstructor
public class AccountController {

	private final AccountService accountService;
	private final NotificationEmailService notificationEmailService;

	@GetMapping
	public AccountResponse getAccount(Authentication authentication) {
		return accountService.getAccount(authentication.getName());
	}

	@PutMapping("/username")
	public TokenResponse changeUsername(Authentication authentication, @Valid @RequestBody ChangeUsernameRequest request) {
		return accountService.changeUsername(authentication.getName(), request);
	}

	@PutMapping("/password")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
		accountService.changePassword(authentication.getName(), request);
	}

	@PostMapping("/notification-email")
	public VerificationSentResponse sendVerificationCode(Authentication authentication,
			@Valid @RequestBody NotificationEmailRequest request) {
		return notificationEmailService.sendVerificationCode(authentication.getName(), request.email());
	}

	@PostMapping("/notification-email/verify")
	public AccountResponse verifyNotificationEmail(Authentication authentication,
			@Valid @RequestBody VerifyNotificationEmailRequest request) {
		notificationEmailService.verify(authentication.getName(), request.code());
		return accountService.getAccount(authentication.getName());
	}

	@PutMapping("/notifications")
	public AccountResponse changeNotifications(Authentication authentication,
			@Valid @RequestBody NotificationPreferencesRequest request) {
		notificationEmailService.changeAlertsEnabled(authentication.getName(), request.enabled());
		return accountService.getAccount(authentication.getName());
	}

	@DeleteMapping("/notification-email")
	public AccountResponse removeNotificationEmail(Authentication authentication) {
		notificationEmailService.removeEmail(authentication.getName());
		return accountService.getAccount(authentication.getName());
	}

}
