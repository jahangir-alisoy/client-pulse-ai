package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.dto.AnalysisFilter;
import az.client_pulse_ai_backend.dto.AnalysisRequestDetailResponse;
import az.client_pulse_ai_backend.dto.AnalysisRequestSummaryResponse;
import az.client_pulse_ai_backend.dto.AnalysisStatisticsResponse;
import az.client_pulse_ai_backend.dto.ScoreCount;
import az.client_pulse_ai_backend.dto.ScoreRangeStatistics;
import az.client_pulse_ai_backend.dto.StatusCount;
import az.client_pulse_ai_backend.entity.AnalysisStatus;
import az.client_pulse_ai_backend.entity.Channel;
import az.client_pulse_ai_backend.exception.ResourceNotFoundException;
import az.client_pulse_ai_backend.repository.AnalysisRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisRequestService {

	private static final int MAX_SCORE = 100;
	private static final int SCORE_RANGE_SIZE = 20;
	private static final int SCORE_RANGE_COUNT = MAX_SCORE / SCORE_RANGE_SIZE;

	private final AnalysisRequestRepository analysisRequestRepository;

	public Page<AnalysisRequestSummaryResponse> findAll(AnalysisFilter filter, Pageable pageable) {
		return analysisRequestRepository.findAllMatching(filter.fromOrMin(), filter.toOrMax(), filter.channels(), pageable)
				.map(AnalysisRequestSummaryResponse::from);
	}

	public AnalysisRequestDetailResponse findById(Long id) {
		return analysisRequestRepository.findById(id)
				.map(AnalysisRequestDetailResponse::from)
				.orElseThrow(() -> new ResourceNotFoundException("Analysis request not found: " + id));
	}

	public AnalysisStatisticsResponse getStatistics(AnalysisFilter filter) {
		Instant from = filter.fromOrMin();
		Instant to = filter.toOrMax();
		Set<Channel> channels = filter.channels();
		Map<AnalysisStatus, Long> statusCounts = analysisRequestRepository.countByStatus(from, to, channels).stream()
				.collect(Collectors.toMap(StatusCount::status, StatusCount::count));
		long pending = statusCounts.getOrDefault(AnalysisStatus.PENDING, 0L);
		long completed = statusCounts.getOrDefault(AnalysisStatus.COMPLETED, 0L);
		long failed = statusCounts.getOrDefault(AnalysisStatus.FAILED, 0L);

		return new AnalysisStatisticsResponse(
				pending + completed + failed,
				pending,
				completed,
				failed,
				analysisRequestRepository.findAverageScore(from, to, channels),
				analysisRequestRepository.findDailyStatistics(from, to, channels),
				analysisRequestRepository.findChannelStatistics(from, to, channels),
				toScoreDistribution(analysisRequestRepository.countByScore(from, to, channels))
		);
	}

	private List<ScoreRangeStatistics> toScoreDistribution(List<ScoreCount> scoreCounts) {
		return IntStream.range(0, SCORE_RANGE_COUNT)
				.mapToObj(rangeIndex -> toScoreRange(rangeIndex, scoreCounts))
				.toList();
	}

	private ScoreRangeStatistics toScoreRange(int rangeIndex, List<ScoreCount> scoreCounts) {
		int from = rangeIndex * SCORE_RANGE_SIZE;
		int to = rangeIndex == SCORE_RANGE_COUNT - 1 ? MAX_SCORE : from + SCORE_RANGE_SIZE - 1;
		long count = scoreCounts.stream()
				.filter(scoreCount -> scoreCount.score() >= from && scoreCount.score() <= to)
				.mapToLong(ScoreCount::count)
				.sum();
		return new ScoreRangeStatistics(from, to, count);
	}

}
