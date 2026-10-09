package az.client_pulse_ai_backend.config;

import az.client_pulse_ai_backend.mail.EmailSender;
import az.client_pulse_ai_backend.mail.LoggingEmailSender;
import az.client_pulse_ai_backend.mail.SmtpEmailSender;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.Properties;

@Configuration
public class EmailConfig {

	private static final String TIMEOUT_MILLIS = "10000";

	@Bean
	public EmailSender emailSender(MailServerProperties mailServerProperties) {
		if (!StringUtils.hasText(mailServerProperties.host())) {
			return new LoggingEmailSender();
		}
		return new SmtpEmailSender(createMailSender(mailServerProperties), mailServerProperties.from());
	}

	private JavaMailSenderImpl createMailSender(MailServerProperties mailServerProperties) {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost(mailServerProperties.host());
		mailSender.setPort(mailServerProperties.port());
		mailSender.setDefaultEncoding(StandardCharsets.UTF_8.name());
		Properties javaMailProperties = new Properties();
		if (StringUtils.hasText(mailServerProperties.username())) {
			mailSender.setUsername(mailServerProperties.username());
			mailSender.setPassword(mailServerProperties.password());
			javaMailProperties.put("mail.smtp.auth", "true");
		}
		javaMailProperties.put("mail.smtp.starttls.enable", String.valueOf(mailServerProperties.starttls()));
		javaMailProperties.put("mail.smtp.connectiontimeout", TIMEOUT_MILLIS);
		javaMailProperties.put("mail.smtp.timeout", TIMEOUT_MILLIS);
		javaMailProperties.put("mail.smtp.writetimeout", TIMEOUT_MILLIS);
		mailSender.setJavaMailProperties(javaMailProperties);
		return mailSender;
	}

}
