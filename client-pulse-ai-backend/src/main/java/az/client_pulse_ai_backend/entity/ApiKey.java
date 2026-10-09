package az.client_pulse_ai_backend.entity;

import az.client_pulse_ai_backend.security.ApiKeySecret;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "api_keys")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ApiKey {

	public static final int MAX_NAME_LENGTH = 60;

	private static final String MASK = "••••••••";

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User owner;

	@Column(nullable = false, length = MAX_NAME_LENGTH)
	private String name;

	@Column(nullable = false)
	private String prefix;

	@Column(nullable = false)
	private String lastFour;

	@Column(nullable = false, unique = true)
	private String secretHash;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	private Instant rotatedAt;

	private Instant lastUsedAt;

	public ApiKey(User owner, String name, ApiKeySecret secret) {
		this.owner = owner;
		this.name = name;
		applySecret(secret);
	}

	public void rename(String name) {
		this.name = name;
	}

	public void rotate(ApiKeySecret secret) {
		applySecret(secret);
		this.rotatedAt = Instant.now();
	}

	public void markUsed() {
		this.lastUsedAt = Instant.now();
	}

	public String maskedKey() {
		return prefix + MASK + lastFour;
	}

	private void applySecret(ApiKeySecret secret) {
		this.prefix = secret.prefix();
		this.lastFour = secret.lastFour();
		this.secretHash = secret.hash();
	}

}
