package az.client_pulse_ai_backend.config;

import az.client_pulse_ai_backend.entity.User;
import az.client_pulse_ai_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DemoUserInitializer implements ApplicationRunner {

	private static final String DEMO_USERNAME = "admin";
	private static final String DEMO_PASSWORD = "admin";

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(ApplicationArguments args) {
		if (!userRepository.existsByUsername(DEMO_USERNAME)) {
			userRepository.save(new User(DEMO_USERNAME, passwordEncoder.encode(DEMO_PASSWORD)));
		}
	}

}
