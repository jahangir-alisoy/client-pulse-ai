package az.client_pulse_ai_backend.mail;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Slf4j
@RequiredArgsConstructor
public class SmtpEmailSender implements EmailSender {

	private static final String DELIVERY_FAILED_MESSAGE = "Could not send the email. Check the mail server settings.";

	private final JavaMailSender mailSender;
	private final String from;

	@Override
	public void send(String to, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(to);
		message.setSubject(subject);
		message.setText(body);
		try {
			mailSender.send(message);
		} catch (MailException exception) {
			log.error("Sending email \"{}\" to {} failed", subject, to, exception);
			throw new EmailDeliveryException(DELIVERY_FAILED_MESSAGE, exception);
		}
	}

	@Override
	public EmailDelivery delivery() {
		return EmailDelivery.SMTP;
	}

}
