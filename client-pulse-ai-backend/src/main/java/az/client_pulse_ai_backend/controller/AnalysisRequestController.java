package az.client_pulse_ai_backend.controller;

import az.client_pulse_ai_backend.dto.AnalysisRequestDetailResponse;
import az.client_pulse_ai_backend.dto.AnalysisRequestSummaryResponse;
import az.client_pulse_ai_backend.dto.AnalysisStatisticsResponse;
import az.client_pulse_ai_backend.service.AnalysisRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analysis-requests")
@RequiredArgsConstructor
public class AnalysisRequestController {

	private final AnalysisRequestService analysisRequestService;

	@GetMapping
	public PagedModel<AnalysisRequestSummaryResponse> findAll(
			@PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return new PagedModel<>(analysisRequestService.findAll(pageable));
	}

	@GetMapping("/{id}")
	public AnalysisRequestDetailResponse findById(@PathVariable Long id) {
		return analysisRequestService.findById(id);
	}

	@GetMapping("/statistics")
	public AnalysisStatisticsResponse getStatistics() {
		return analysisRequestService.getStatistics();
	}

}
