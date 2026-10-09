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

@Entity
@Table(name = "support_agents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SupportAgent {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String employeeNumber;

	@Column(nullable = false)
	private String fullName;

	private String team;

	public SupportAgent(String employeeNumber, String fullName, String team) {
		this.employeeNumber = employeeNumber;
		this.fullName = fullName;
		this.team = team;
	}

}
