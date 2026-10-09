package az.client_pulse_ai_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.Duration;
import java.time.Instant;

@Entity
@Table(name = "notification_settings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NotificationSettings {

	private static final int MAX_EMAIL_LENGTH = 254;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(length = MAX_EMAIL_LENGTH)
	private String email;

	@ColumnDefault("false")
	@Column(nullable = false)
	private boolean enabled;

	@Column(length = MAX_EMAIL_LENGTH)
	private String pendingEmail;

	private String pendingCodeHash;

	private Instant pendingCodeSentAt;

	private Instant pendingCodeExpiresAt;

	@ColumnDefault("0")
	@Column(nullable = false)
	private int failedVerificationAttempts;

	public NotificationSettings(User user) {
		this.user = user;
	}

	public boolean isCodeResendBlocked(Instant now, Duration cooldown) {
		return pendingCodeSentAt != null && now.isBefore(pendingCodeSentAt.plus(cooldown));
	}

	public void startVerification(String pendingEmail, String codeHash, Instant sentAt, Instant expiresAt) {
		this.pendingEmail = pendingEmail;
		this.pendingCodeHash = codeHash;
		this.pendingCodeSentAt = sentAt;
		this.pendingCodeExpiresAt = expiresAt;
		this.failedVerificationAttempts = 0;
	}

	public boolean hasPendingEmail() {
		return pendingEmail != null;
	}

	public boolean hasPendingCode() {
		return pendingCodeHash != null;
	}

	public boolean isPendingCodeExpired(Instant now) {
		return pendingCodeExpiresAt == null || !now.isBefore(pendingCodeExpiresAt);
	}

	public int recordFailedVerificationAttempt() {
		this.failedVerificationAttempts++;
		return failedVerificationAttempts;
	}

	public void invalidatePendingCode() {
		this.pendingCodeHash = null;
		this.pendingCodeExpiresAt = null;
	}

	public void confirmPendingEmail() {
		this.email = pendingEmail;
		this.enabled = true;
		clearPendingVerification();
	}

	public boolean hasVerifiedEmail() {
		return email != null;
	}

	public void changeAlertsEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public boolean receivesAlerts() {
		return enabled && hasVerifiedEmail();
	}

	public void removeEmails() {
		this.email = null;
		this.enabled = false;
		clearPendingVerification();
	}

	private void clearPendingVerification() {
		this.pendingEmail = null;
		this.pendingCodeHash = null;
		this.pendingCodeExpiresAt = null;
		this.failedVerificationAttempts = 0;
	}

}
