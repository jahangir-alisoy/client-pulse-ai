package az.client_pulse_ai_backend.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "analysis_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnalysisRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private UUID sessionId;

	@Enumerated(EnumType.STRING)
	@ColumnDefault("'CHAT'")
	@Column(nullable = false)
	private Channel channel;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_id")
	private Customer customer;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "support_agent_id")
	private SupportAgent supportAgent;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id")
	private User owner;

	private String apiKeyMasked;

	@ElementCollection
	@CollectionTable(name = "analysis_request_messages", joinColumns = @JoinColumn(name = "analysis_request_id"))
	@OrderColumn(name = "position")
	private List<AnalysisMessage> messages = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AnalysisStatus status;

	private Integer score;

	@Column(columnDefinition = "text")
	private String description;

	@Column(columnDefinition = "text")
	private String failureReason;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	private Instant analyzedAt;

	public AnalysisRequest(UUID sessionId, Channel channel, Customer customer, SupportAgent supportAgent,
			User owner, String apiKeyMasked, List<AnalysisMessage> messages) {
		this.sessionId = sessionId;
		this.channel = channel;
		this.customer = customer;
		this.supportAgent = supportAgent;
		this.owner = owner;
		this.apiKeyMasked = apiKeyMasked;
		this.messages = new ArrayList<>(messages);
		this.status = AnalysisStatus.PENDING;
	}

	public void complete(int score, String description) {
		this.status = AnalysisStatus.COMPLETED;
		this.score = score;
		this.description = description;
		this.analyzedAt = Instant.now();
	}

	public void fail(String failureReason) {
		this.status = AnalysisStatus.FAILED;
		this.failureReason = failureReason;
		this.analyzedAt = Instant.now();
	}

}
