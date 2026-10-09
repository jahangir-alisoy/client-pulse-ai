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
@Table(name = "customers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String customerNumber;

	@Column(nullable = false)
	private String fullName;

	private String email;

	private String phone;

	public Customer(String customerNumber, String fullName, String email, String phone) {
		this.customerNumber = customerNumber;
		this.fullName = fullName;
		this.email = email;
		this.phone = phone;
	}

}
