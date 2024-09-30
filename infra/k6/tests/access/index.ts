import http from 'k6/http';
import { sleep, check } from 'k6';

// Configurações de execução do teste
export const options = {
	vus: 1,
	iterations: 10,
};

const BASE_URL = 'http://localhost:9000/2015-03-31/functions/function/invocations'; // Atualize com a URL base da sua API

export default function () {
	// Calcular o clientId sequencialmente de 1 a 999
	let globalIteration = __ITER * 10 + __VU; // __ITER começa em 0
	let clientId = globalIteration % 999 || 999; // Garante que clientId é de 1 a 999

	const payload = JSON.stringify({
		pathParameters: {
			id: clientId.toString(),
		},
	});

	const params = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const res = http.post(`${BASE_URL}`, payload, params);

	console.log(res);

	check(res, {
		'status code é 200': (r) => r.status === 200,
		'resposta é rápida': (r) => r.timings.duration < 500,
	});

	sleep(1);
}
