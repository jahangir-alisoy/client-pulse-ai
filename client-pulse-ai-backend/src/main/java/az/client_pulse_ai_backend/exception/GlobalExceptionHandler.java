package az.client_pulse_ai_backend.exception;

import az.client_pulse_ai_backend.ai.AiResponseException;
import az.client_pulse_ai_backend.mail.EmailDeliveryException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final String CODE_PROPERTY = "code";
	private static final String API_KEY_UNAVAILABLE_CODE = "API_KEY_UNAVAILABLE";
	private static final String INVALID_API_KEY_CODE = "INVALID_API_KEY";
	private static final String INVALID_REQUEST_DETAIL = "The request is invalid.";
	private static final String UNREADABLE_BODY_DETAIL = "The request body is missing or malformed.";

	@ExceptionHandler(AuthenticationException.class)
	public ProblemDetail handleAuthenticationException(AuthenticationException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, exception.getMessage());
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ProblemDetail handleResourceNotFoundException(ResourceNotFoundException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
	}

	@ExceptionHandler(AiResponseException.class)
	public ProblemDetail handleAiResponseException(AiResponseException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_GATEWAY, exception.getMessage());
	}

	@ExceptionHandler(BadRequestException.class)
	public ProblemDetail handleBadRequestException(BadRequestException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
	}

	@ExceptionHandler(ConflictException.class)
	public ProblemDetail handleConflictException(ConflictException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, exception.getMessage());
	}

	@ExceptionHandler(TooManyRequestsException.class)
	public ProblemDetail handleTooManyRequestsException(TooManyRequestsException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.TOO_MANY_REQUESTS, exception.getMessage());
	}

	@ExceptionHandler(ApiKeyUnavailableException.class)
	public ProblemDetail handleApiKeyUnavailableException(ApiKeyUnavailableException exception) {
		return withCode(ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, exception.getMessage()), API_KEY_UNAVAILABLE_CODE);
	}

	@ExceptionHandler(InvalidApiKeyException.class)
	public ProblemDetail handleInvalidApiKeyException(InvalidApiKeyException exception) {
		return withCode(ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, exception.getMessage()), INVALID_API_KEY_CODE);
	}

	@ExceptionHandler(EmailDeliveryException.class)
	public ProblemDetail handleEmailDeliveryException(EmailDeliveryException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_GATEWAY, exception.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ProblemDetail handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, describeFirstError(exception));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ProblemDetail handleHttpMessageNotReadableException(HttpMessageNotReadableException exception) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, UNREADABLE_BODY_DETAIL);
	}

	private ProblemDetail withCode(ProblemDetail problemDetail, String code) {
		problemDetail.setProperty(CODE_PROPERTY, code);
		return problemDetail;
	}

	private String describeFirstError(MethodArgumentNotValidException exception) {
		FieldError fieldError = exception.getBindingResult().getFieldError();
		if (fieldError != null) {
			return fieldError.getField() + ": " + fieldError.getDefaultMessage();
		}
		return exception.getBindingResult().getAllErrors().stream()
				.findFirst()
				.map(ObjectError::getDefaultMessage)
				.orElse(INVALID_REQUEST_DETAIL);
	}

}
