package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.dto.SupportAgentResponse;
import az.client_pulse_ai_backend.entity.SupportAgent;
import az.client_pulse_ai_backend.exception.ResourceNotFoundException;
import az.client_pulse_ai_backend.repository.SupportAgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupportAgentService {

	private final SupportAgentRepository supportAgentRepository;

	public List<SupportAgentResponse> findAll() {
		return supportAgentRepository.findAll(Sort.by("fullName")).stream().map(SupportAgentResponse::from).toList();
	}

	public SupportAgent getById(Long id) {
		return supportAgentRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Support agent not found: " + id));
	}

}
