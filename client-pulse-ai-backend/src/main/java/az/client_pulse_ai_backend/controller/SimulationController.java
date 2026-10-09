package az.client_pulse_ai_backend.controller;

import az.client_pulse_ai_backend.dto.SimulationChatRequest;
import az.client_pulse_ai_backend.dto.SimulationChatResponse;
import az.client_pulse_ai_backend.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/simulation")
@RequiredArgsConstructor
public class SimulationController {

	private final SimulationService simulationService;

	@PostMapping("/chat")
	public SimulationChatResponse chat(@Valid @RequestBody SimulationChatRequest request) {
		return simulationService.chat(request);
	}

}
