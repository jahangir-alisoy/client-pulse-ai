package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.config.NotificationProperties;
import az.client_pulse_ai_backend.dto.AccountResponse;
import az.client_pulse_ai_backend.dto.ChangePasswordRequest;
import az.client_pulse_ai_backend.dto.ChangeUsernameRequest;
import az.client_pulse_ai_backend.dto.TokenResponse;
import az.client_pulse_ai_backend.entity.User;
import az.client_pulse_ai_backend.exception.BadRequestException;
import az.client_pulse_ai_backend.exception.ConflictException;
import az.client_pulse_ai_backend.mail.EmailSender;
import az.client_pulse_ai_backend.repository.NotificationSettingsRepository;
import az.client_pulse_ai_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

	private final UserService userService;
	private final UserRepository userRepository;
	private final NotificationSettingsRepository notificationSettingsRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthService authService;
	private final NotificationProperties notificationProperties;
	private final EmailSender emailSender;

	@Transactional(readOnly = true)
	public AccountResponse getAccount(String username) {
		User user = userService.getByUsername(username);
		return AccountResponse.of(
				user.getUsername(),
				notificationSettingsRepository.findByUserId(user.getId()),
				notificationProperties.alertThreshold(),
				emailSender.delivery());
	}

	public TokenResponse changeUsername(String username, ChangeUsernameRequest request) {
		User user = userService.getLockedByUsername(username);
		requireCurrentPassword(user, request.currentPassword());
		String newUsername = request.newUsername();
		if (newUsername.equals(user.getUsername())) {
			throw new BadRequestException("The new username is the same as the current one.");
		}
		if (userRepository.existsByUsername(newUsername)) {
			throw new ConflictException("This username is already taken.");
		}
		user.changeUsername(newUsername);
		return authService.issueTokens(newUsername);
	}

	public void changePassword(String username, ChangePasswordRequest request) {
		User user = userService.getLockedByUsername(username);
		requireCurrentPassword(user, request.currentPassword());
		if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
			throw new BadRequestException("The new password must be different from the current one.");
		}
		user.changePassword(passwordEncoder.encode(request.newPassword()));
	}

	private void requireCurrentPassword(User user, String currentPassword) {
		if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
			throw new BadRequestException("Current password is incorrect.");
		}
	}

}
