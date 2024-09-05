import http from 'k6/http';
import { check, sleep } from 'k6';

// Configurações de execução do teste
export const options = {
	stages: [
		{ duration: '30s', target: 10 }, // Sobe para 10 usuários simultâneos em 30 segundos
		{ duration: '1m', target: 10 }, // Mantém 10 usuários por 1 minuto
		{ duration: '30s', target: 0 }, // Diminui para 0 usuários
	],
	thresholds: {
		http_req_duration: ['p(95)<500'], // 95% das requisições devem responder em menos de 500ms
	},
};

export default function () {
	const res = http.get('http://localhost:8080/canonico/produtos/load');
	check(res, {
		'status code é 200': (r) => r.status === 200,
		'resposta é rápida': (r) => r.timings.duration < 500,
	});

	sleep(1);
}
