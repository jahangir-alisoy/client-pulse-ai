package az.client_pulse_ai_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "application")
public record FrontendProperties(
		@DefaultValue("http://localhost:5173") String frontendUrl
) {

	public String linkTo(String path) {
		return frontendUrl.replaceAll("/+$", "") + path;
	}

}
