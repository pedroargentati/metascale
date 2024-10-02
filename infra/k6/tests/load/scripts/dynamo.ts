import http from 'k6/http';
import { sleep, check } from 'k6';

// Configurações de execução do teste
export const options = {
	scenarios: {
		load_test: {
			executor: 'constant-vus',
			vus: 250, // Número de VUs (usuários virtuais) simultâneos
			duration: '1s', // Duração de 1 segundo para fazer as requisições simultâneas
		},
	},
	thresholds: {
		http_req_duration: ['p(95)<1000'], // 95% das requisições devem responder em menos de 1000ms
	},
};

const BASE_URL = 'http://3.147.89.20'; // Atualize com a URL base da sua API
const ENDPOINT = '/canonico/clienteProduto'; // Endpoint específico
''
export default function () {
	const res = http.get(`${BASE_URL}${ENDPOINT}`);

	check(res, {
		'status code é 200': (r) => r.status === 200,
		'resposta é rápida': (r) => r.timings.duration < 500,
	});

	sleep(1);
}
