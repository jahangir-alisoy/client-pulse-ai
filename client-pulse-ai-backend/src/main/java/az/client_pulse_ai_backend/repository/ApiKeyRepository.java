package az.client_pulse_ai_backend.repository;

import az.client_pulse_ai_backend.entity.ApiKey;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

	List<ApiKey> findAllByOwnerUsernameOrderByCreatedAtDescIdDesc(String username);

	@EntityGraph(attributePaths = "owner")
	Optional<ApiKey> findByIdAndOwnerUsername(Long id, String username);

	@EntityGraph(attributePaths = "owner")
	Optional<ApiKey> findBySecretHash(String secretHash);

	long countByOwnerId(Long ownerId);

}
