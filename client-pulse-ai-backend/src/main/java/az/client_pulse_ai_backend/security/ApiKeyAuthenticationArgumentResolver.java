package az.client_pulse_ai_backend.security;

import az.client_pulse_ai_backend.service.ApiKeyAccessService;
import az.client_pulse_ai_backend.service.AuthenticatedApiKey;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
@RequiredArgsConstructor
public class ApiKeyAuthenticationArgumentResolver implements HandlerMethodArgumentResolver {

	public static final String API_KEY_HEADER = "X-API-Key";

	private final ApiKeyAccessService apiKeyAccessService;

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return AuthenticatedApiKey.class.equals(parameter.getParameterType());
	}

	@Override
	public AuthenticatedApiKey resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
		return apiKeyAccessService.authenticate(webRequest.getHeader(API_KEY_HEADER));
	}

}
