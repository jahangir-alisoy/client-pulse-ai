package az.client_pulse_ai_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String username;

	@Column(nullable = false)
	private String password;

	@ColumnDefault("false")
	@Column(nullable = false)
	private boolean apiKeyProvisioned;

	public User(String username, String encodedPassword) {
		this.username = username;
		this.password = encodedPassword;
	}

	public void changeUsername(String username) {
		this.username = username;
	}

	public void changePassword(String encodedPassword) {
		this.password = encodedPassword;
	}

	public void markApiKeyProvisioned() {
		this.apiKeyProvisioned = true;
	}

}
