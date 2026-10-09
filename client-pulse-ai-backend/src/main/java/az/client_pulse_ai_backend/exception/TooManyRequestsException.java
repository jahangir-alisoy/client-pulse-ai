package az.client_pulse_ai_backend.exception;

public class TooManyRequestsException extends RuntimeException {

	public TooManyRequestsException(String message) {
		super(message);
	}

}
