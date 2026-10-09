package az.client_pulse_ai_backend.security;

import az.client_pulse_ai_backend.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {

	private static final String TOKEN_TYPE_CLAIM = "type";

	private final JwtProperties jwtProperties;
	private final SecretKey signingKey;

	public JwtService(JwtProperties jwtProperties) {
		this.jwtProperties = jwtProperties;
		this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secretKey()));
	}

	public String generateAccessToken(String username) {
		return generateToken(username, TokenType.ACCESS, jwtProperties.accessToken().expiration());
	}

	public String generateRefreshToken(String username) {
		return generateToken(username, TokenType.REFRESH, jwtProperties.refreshToken().expiration());
	}

	public Optional<String> extractUsername(String token, TokenType tokenType) {
		try {
			Claims claims = Jwts.parser()
					.verifyWith(signingKey)
					.build()
					.parseSignedClaims(token)
					.getPayload();
			return tokenType.name().equals(claims.get(TOKEN_TYPE_CLAIM, String.class))
					? Optional.ofNullable(claims.getSubject())
					: Optional.empty();
		} catch (JwtException | IllegalArgumentException exception) {
			return Optional.empty();
		}
	}

	private String generateToken(String username, TokenType tokenType, long expirationMillis) {
		Instant now = Instant.now();
		return Jwts.builder()
				.subject(username)
				.claim(TOKEN_TYPE_CLAIM, tokenType.name())
				.issuedAt(Date.from(now))
				.expiration(Date.from(now.plusMillis(expirationMillis)))
				.signWith(signingKey)
				.compact();
	}

}
