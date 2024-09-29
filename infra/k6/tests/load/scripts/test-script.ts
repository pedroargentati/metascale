import http from 'k6/http';
import { sleep, check } from 'k6';

// Configurações de execução do teste
export const options = {
	scenarios: {
		load_test: {
			executor: 'constant-vus',
			vus: 20, // Número de VUs (usuários virtuais) simultâneos
			duration: '1s', // Duração de 1 segundo para fazer as requisições simultâneas
		},
	},
	thresholds: {
		http_req_duration: ['p(95)<1000'], // 95% das requisições devem responder em menos de 1000ms
	},
};

const BASE_URL = 'http://localhost:8080'; // Atualize com a URL base da sua API
const ENDPOINT = '/canonico/cliente/load'; // Endpoint específico

export default function () {
	// Calcular o clientId sequencialmente de 1 a 999
	let globalIteration = __ITER * 10 + __VU; // __ITER começa em 0
	let clientId = globalIteration % 999 || 999; // Garante que clientId é de 1 a 999

	const payload = JSON.stringify({
		getCustomer: {
			id: clientId.toString(),
		},
	});

	const params = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const res = http.post(`${BASE_URL}${ENDPOINT}`, payload, params);

	check(res, {
		'status code é 200': (r) => r.status === 200,
		'resposta é rápida': (r) => r.timings.duration < 500,
	});

	sleep(1);
}
