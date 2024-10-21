import http from 'k6/http';
import { sleep, check } from 'k6';

// Configurações de execução do teste
export const options = {
	vus: 1,
	iterations: 1,
};

export default function () {
	// Calcular o clientId sequencialmente de 1 a 999
	let globalIteration = __ITER * 10 + __VU; // __ITER começa em 0
	let clientId = globalIteration % 999 || 999; // Garante que clientId é de 1 a 999

	const url = `https://yevmnahqjc.execute-api.us-east-2.amazonaws.com/v1/cliente/${clientId.toString()}`;
	const headers = {
		'X-API-Key': '',
		'X-Amz-Date': '20241002T215415Z', // Update if needed for dynamic dates
		'Authorization': 'AWS4-HMAC-SHA256 Credential=', // Update if needed for dynamic signatures
	};

	const res = http.get(url, { headers });

	console.log(res);

	check(res, {
		'status code é 200': (r) => r.status === 200,
		'resposta é rápida': (r) => r.timings.duration < 500,
	});
}
