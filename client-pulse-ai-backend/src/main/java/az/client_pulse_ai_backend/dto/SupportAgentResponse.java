package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.SupportAgent;

public record SupportAgentResponse(
		Long id,
		String employeeNumber,
		String fullName,
		String team
) {

	public static SupportAgentResponse from(SupportAgent supportAgent) {
		return supportAgent == null ? null : new SupportAgentResponse(
				supportAgent.getId(),
				supportAgent.getEmployeeNumber(),
				supportAgent.getFullName(),
				supportAgent.getTeam()
		);
	}

}
