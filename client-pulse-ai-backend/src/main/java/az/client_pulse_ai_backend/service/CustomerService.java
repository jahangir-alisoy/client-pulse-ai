package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.dto.CustomerResponse;
import az.client_pulse_ai_backend.entity.Customer;
import az.client_pulse_ai_backend.exception.ResourceNotFoundException;
import az.client_pulse_ai_backend.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

	private final CustomerRepository customerRepository;

	public List<CustomerResponse> findAll() {
		return customerRepository.findAll(Sort.by("fullName")).stream().map(CustomerResponse::from).toList();
	}

	public Customer getById(Long id) {
		return customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
	}

}
