package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.Customer;

public record CustomerResponse(
		Long id,
		String customerNumber,
		String fullName,
		String email,
		String phone
) {

	public static CustomerResponse from(Customer customer) {
		return customer == null ? null : new CustomerResponse(
				customer.getId(),
				customer.getCustomerNumber(),
				customer.getFullName(),
				customer.getEmail(),
				customer.getPhone()
		);
	}

}
