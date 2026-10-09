package az.client_pulse_ai_backend.dto;

import az.client_pulse_ai_backend.entity.Channel;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;

public record AnalysisFilter(
		@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
		@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
		Channel channel
) {

	private static final Instant MAX_INSTANT = Instant.parse("9999-12-31T00:00:00Z");

	public Instant fromOrMin() {
		return Optional.ofNullable(from).orElse(Instant.EPOCH);
	}

	public Instant toOrMax() {
		return Optional.ofNullable(to).orElse(MAX_INSTANT);
	}

	public Set<Channel> channels() {
		return channel == null ? EnumSet.allOf(Channel.class) : EnumSet.of(channel);
	}

}
