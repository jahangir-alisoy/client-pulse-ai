package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.NotificationSettings;
import az.client_pulse_ai_backend.mail.EmailDelivery;

import java.util.Optional;

public record AccountResponse(
		String username,
		String notificationEmail,
		String pendingNotificationEmail,
		boolean notificationsEnabled,
		int alertThreshold,
		EmailDelivery emailDelivery
) {

	public static AccountResponse of(String username, Optional<NotificationSettings> settings, int alertThreshold,
			EmailDelivery emailDelivery) {
		return new AccountResponse(
				username,
				settings.map(NotificationSettings::getEmail).orElse(null),
				settings.map(NotificationSettings::getPendingEmail).orElse(null),
				settings.map(NotificationSettings::receivesAlerts).orElse(false),
				alertThreshold,
				emailDelivery
		);
	}

}
