package az.client_pulse_ai_backend.dto;

import java.util.List;

public record AnalysisStatisticsResponse(
		long totalRequests,
		long pendingRequests,
		long completedRequests,
		long failedRequests,
		Double averageScore,
		List<DailyStatistics> dailyStatistics,
		List<ChannelStatistics> channelStatistics,
		List<ScoreRangeStatistics> scoreDistribution
) {
}
