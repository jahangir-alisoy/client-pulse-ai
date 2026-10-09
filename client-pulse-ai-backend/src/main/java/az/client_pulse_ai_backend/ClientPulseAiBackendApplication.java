package az.client_pulse_ai_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@ConfigurationPropertiesScan
@SpringBootApplication
public class ClientPulseAiBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClientPulseAiBackendApplication.class, args);
	}

}
