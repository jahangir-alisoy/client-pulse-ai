package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.Channel;

public record ChannelStatistics(
		Channel channel,
		Long requestCount,
		Double averageScore
) {
}
