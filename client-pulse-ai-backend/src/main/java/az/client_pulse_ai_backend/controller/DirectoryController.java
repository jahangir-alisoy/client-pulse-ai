package az.client_pulse_ai_backend.controller;

import az.client_pulse_ai_backend.dto.CustomerResponse;
import az.client_pulse_ai_backend.dto.SupportAgentResponse;
import az.client_pulse_ai_backend.service.CustomerService;
import az.client_pulse_ai_backend.service.SupportAgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DirectoryController {

	private final CustomerService customerService;
	private final SupportAgentService supportAgentService;

	@GetMapping("/customers")
	public List<CustomerResponse> findCustomers() {
		return customerService.findAll();
	}

	@GetMapping("/support-agents")
	public List<SupportAgentResponse> findSupportAgents() {
		return supportAgentService.findAll();
	}

}
