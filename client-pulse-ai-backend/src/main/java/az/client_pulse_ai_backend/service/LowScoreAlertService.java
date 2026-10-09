package az.client_pulse_ai_backend.service;

import az.client_pulse_ai_backend.config.NotificationProperties;
import az.client_pulse_ai_backend.entity.AnalysisRequest;
import az.client_pulse_ai_backend.entity.AnalysisStatus;
import az.client_pulse_ai_backend.entity.NotificationSettings;
import az.client_pulse_ai_backend.mail.EmailSender;
import az.client_pulse_ai_backend.repository.NotificationSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LowScoreAlertService {

	private final NotificationSettingsRepository notificationSettingsRepository;
	private final NotificationProperties notificationProperties;
	private final LowScoreAlertEmailComposer lowScoreAlertEmailComposer;
	private final EmailSender emailSender;

	public void alertIfBelowThreshold(AnalysisRequest analysisRequest) {
		try {
			if (isBelowThreshold(analysisRequest) && analysisRequest.getOwner() != null) {
				notificationSettingsRepository.findByUserId(analysisRequest.getOwner().getId())
						.filter(NotificationSettings::receivesAlerts)
						.ifPresent(settings -> send(settings.getEmail(), analysisRequest));
			}
		} catch (RuntimeException exception) {
			log.error("Could not send the low score alert for analysis request {}", analysisRequest.getId(), exception);
		}
	}

	private boolean isBelowThreshold(AnalysisRequest analysisRequest) {
		return analysisRequest.getStatus() == AnalysisStatus.COMPLETED
				&& analysisRequest.getScore() != null
				&& analysisRequest.getScore() < notificationProperties.alertThreshold();
	}

	private void send(String email, AnalysisRequest analysisRequest) {
		LowScoreAlertEmail alert = lowScoreAlertEmailComposer.compose(analysisRequest);
		emailSender.send(email, alert.subject(), alert.body());
		log.info("Low score alert for analysis request {} sent", analysisRequest.getId());
	}

}
