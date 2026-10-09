package az.client_pulse_ai_backend.mail;

public interface EmailSender {

	void send(String to, String subject, String body);

	EmailDelivery delivery();

}
