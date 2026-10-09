package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.entity.User;
import az.client_pulse_ai_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

	private static final String ACCOUNT_NOT_FOUND_MESSAGE = "Your account could not be found. Please sign in again.";

	private final UserRepository userRepository;

	public User getByUsername(String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException(ACCOUNT_NOT_FOUND_MESSAGE));
	}

	public User getLockedByUsername(String username) {
		return userRepository.findLockedByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException(ACCOUNT_NOT_FOUND_MESSAGE));
	}

}
