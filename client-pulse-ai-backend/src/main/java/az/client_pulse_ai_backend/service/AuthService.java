package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.dto.LoginRequest;
import az.client_pulse_ai_backend.dto.RefreshTokenRequest;
import az.client_pulse_ai_backend.dto.TokenResponse;
import az.client_pulse_ai_backend.repository.UserRepository;
import az.client_pulse_ai_backend.security.JwtService;
import az.client_pulse_ai_backend.security.TokenType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final ApiKeyService apiKeyService;

	public TokenResponse login(LoginRequest request) {
		authenticationManager.authenticate(
				UsernamePasswordAuthenticationToken.unauthenticated(request.username(), request.password()));
		apiKeyService.provisionDefaultKey(request.username());
		return issueTokens(request.username());
	}

	public TokenResponse refresh(RefreshTokenRequest request) {
		String username = jwtService.extractUsername(request.refreshToken(), TokenType.REFRESH)
				.filter(userRepository::existsByUsername)
				.orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));
		return issueTokens(username);
	}

	public TokenResponse issueTokens(String username) {
		return new TokenResponse(jwtService.generateAccessToken(username), jwtService.generateRefreshToken(username));
	}

}
