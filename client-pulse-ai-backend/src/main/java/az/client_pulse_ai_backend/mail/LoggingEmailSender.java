package az.client_pulse_ai_backend.mail;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoggingEmailSender implements EmailSender {

	@Override
	public void send(String to, String subject, String body) {
		log.info("Email delivery is not configured, logging the email instead.\nTo: {}\nSubject: {}\n\n{}", to, subject, body);
	}

	@Override
	public EmailDelivery delivery() {
		return EmailDelivery.LOG;
	}

}
