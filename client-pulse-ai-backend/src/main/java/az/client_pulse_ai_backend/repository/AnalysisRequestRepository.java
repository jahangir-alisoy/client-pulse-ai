package az.client_pulse_ai_backend.repository;

import az.client_pulse_ai_backend.dto.ChannelStatistics;
import az.client_pulse_ai_backend.dto.DailyStatistics;
import az.client_pulse_ai_backend.dto.ScoreCount;
import az.client_pulse_ai_backend.dto.StatusCount;
import az.client_pulse_ai_backend.entity.AnalysisRequest;
import az.client_pulse_ai_backend.entity.Channel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

public interface AnalysisRequestRepository extends JpaRepository<AnalysisRequest, Long> {

	String FILTER = " r.createdAt >= :from and r.createdAt < :to and r.channel in :channels ";

	@EntityGraph(attributePaths = {"customer", "supportAgent"})
	@Query(value = "select r from AnalysisRequest r where" + FILTER,
			countQuery = "select count(r) from AnalysisRequest r where" + FILTER)
	Page<AnalysisRequest> findAllMatching(@Param("from") Instant from, @Param("to") Instant to,
			@Param("channels") Collection<Channel> channels, Pageable pageable);

	@Query("select new az.client_pulse_ai_backend.dto.StatusCount(r.status, count(r)) from AnalysisRequest r where" + FILTER
			+ "group by r.status")
	List<StatusCount> countByStatus(@Param("from") Instant from, @Param("to") Instant to,
			@Param("channels") Collection<Channel> channels);

	@Query("select avg(r.score) from AnalysisRequest r where" + FILTER)
	Double findAverageScore(@Param("from") Instant from, @Param("to") Instant to,
			@Param("channels") Collection<Channel> channels);

	@Query("select new az.client_pulse_ai_backend.dto.DailyStatistics(cast(r.createdAt as LocalDate), count(r), avg(r.score))"
			+ " from AnalysisRequest r where" + FILTER
			+ "group by cast(r.createdAt as LocalDate) order by cast(r.createdAt as LocalDate)")
	List<DailyStatistics> findDailyStatistics(@Param("from") Instant from, @Param("to") Instant to,
			@Param("channels") Collection<Channel> channels);

	@Query("select new az.client_pulse_ai_backend.dto.ChannelStatistics(r.channel, count(r), avg(r.score))"
			+ " from AnalysisRequest r where" + FILTER + "group by r.channel order by r.channel")
	List<ChannelStatistics> findChannelStatistics(@Param("from") Instant from, @Param("to") Instant to,
			@Param("channels") Collection<Channel> channels);

	@Query("select new az.client_pulse_ai_backend.dto.ScoreCount(r.score, count(r)) from AnalysisRequest r where" + FILTER
			+ "and r.score is not null group by r.score")
	List<ScoreCount> countByScore(@Param("from") Instant from, @Param("to") Instant to,
			@Param("channels") Collection<Channel> channels);

}
