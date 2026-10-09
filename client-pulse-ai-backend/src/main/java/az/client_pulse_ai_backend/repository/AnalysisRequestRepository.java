package az.client_pulse_ai_backend.repository;

import az.client_pulse_ai_backend.dto.DailyStatistics;
import az.client_pulse_ai_backend.dto.ScoreCount;
import az.client_pulse_ai_backend.dto.StatusCount;
import az.client_pulse_ai_backend.entity.AnalysisRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnalysisRequestRepository extends JpaRepository<AnalysisRequest, Long> {

	@Query("""
			select new az.client_pulse_ai_backend.dto.StatusCount(r.status, count(r))
			from AnalysisRequest r
			group by r.status
			""")
	List<StatusCount> countByStatus();

	@Query("select avg(r.score) from AnalysisRequest r")
	Double findAverageScore();

	@Query("""
			select new az.client_pulse_ai_backend.dto.DailyStatistics(cast(r.createdAt as LocalDate), count(r), avg(r.score))
			from AnalysisRequest r
			group by cast(r.createdAt as LocalDate)
			order by cast(r.createdAt as LocalDate)
			""")
	List<DailyStatistics> findDailyStatistics();

	@Query("""
			select new az.client_pulse_ai_backend.dto.ScoreCount(r.score, count(r))
			from AnalysisRequest r
			where r.score is not null
			group by r.score
			""")
	List<ScoreCount> countByScore();

}
