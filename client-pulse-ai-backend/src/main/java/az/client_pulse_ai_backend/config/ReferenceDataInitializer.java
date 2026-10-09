package az.client_pulse_ai_backend.config;

import az.client_pulse_ai_backend.entity.Customer;
import az.client_pulse_ai_backend.entity.SupportAgent;
import az.client_pulse_ai_backend.repository.CustomerRepository;
import az.client_pulse_ai_backend.repository.SupportAgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReferenceDataInitializer implements ApplicationRunner {

	private final CustomerRepository customerRepository;
	private final SupportAgentRepository supportAgentRepository;

	@Override
	public void run(ApplicationArguments args) {
		if (customerRepository.count() == 0) {
			customerRepository.saveAll(List.of(
					new Customer("CUS-10021", "Leyla Mammadova", "leyla.mammadova@example.com", "+994 50 214 33 10"),
					new Customer("CUS-10022", "Rashad Aliyev", "rashad.aliyev@example.com", "+994 55 781 20 44"),
					new Customer("CUS-10023", "Nigar Hasanova", "nigar.hasanova@example.com", "+994 70 302 18 67"),
					new Customer("CUS-10024", "Elvin Guliyev", "elvin.guliyev@example.com", "+994 51 609 47 12"),
					new Customer("CUS-10025", "Aysel Huseynova", "aysel.huseynova@example.com", "+994 77 455 91 03"),
					new Customer("CUS-10026", "Tural Ismayilov", "tural.ismayilov@example.com", "+994 50 118 62 85")
			));
		}
		if (supportAgentRepository.count() == 0) {
			supportAgentRepository.saveAll(List.of(
					new SupportAgent("EMP-201", "Kamran Babayev", "Billing"),
					new SupportAgent("EMP-202", "Sevinj Abdullayeva", "Delivery"),
					new SupportAgent("EMP-203", "Orkhan Mirzayev", "Technical support"),
					new SupportAgent("EMP-204", "Gunel Rzayeva", "Customer care")
			));
		}
	}

}
