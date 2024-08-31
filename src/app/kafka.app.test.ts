import logger from '../config/logger/logger';
import { getCanonicoService, sincronizaCanonicoService } from '../service/canonico';
import kafkaService from '../service/kafka/kafka-service';
import consumeAllCanonicos from './kafka.app';

jest.mock('../config/logger/logger');
jest.mock('../service/canonico');
jest.mock('../service/kafka/kafka-service');

describe('consumeAllCanonicos', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('deve registrar uma mensagem informativa quando nenhum canônico for encontrado', async () => {
		(getCanonicoService as jest.Mock).mockResolvedValue([]);

		await consumeAllCanonicos();

		expect(logger.info).toHaveBeenCalledWith('[APP :: Kafka] Nenhum canônico encontrado para consumir.');
	});

	it('deve registrar uma mensagem de erro quando um canônico não tiver tópicos', async () => {
		const mockCanonicos = [{ nome: 'Canonico1' }];
		(getCanonicoService as jest.Mock).mockResolvedValue(mockCanonicos);

		await consumeAllCanonicos();

		expect(logger.error).toHaveBeenCalledWith(
			'[APP :: Kafka] Canônico Canonico1 não possui tópicos. Continuando...',
		);
	});

	it('deve chamar kafkaService.consume com os tópicos corretos', async () => {
		const mockCanonicos = [{ nome: 'Canonico1', topicos: ['topico1', 'topico2'] }];
		(getCanonicoService as jest.Mock).mockResolvedValue(mockCanonicos);
		(kafkaService.consume as jest.Mock).mockImplementation((topic, callback) => {
			return callback('mockMessage');
		});

		await consumeAllCanonicos();

		expect(kafkaService.consume).toHaveBeenCalledWith('topico1', expect.any(Function));
		expect(kafkaService.consume).toHaveBeenCalledWith('topico2', expect.any(Function));
	});

	it('deve registrar uma mensagem de erro quando sincronizaCanonicoService falhar', async () => {
		const mockCanonicos = [{ nome: 'Canonico1', topicos: ['topico1'] }];
		(getCanonicoService as jest.Mock).mockResolvedValue(mockCanonicos);
		(kafkaService.consume as jest.Mock).mockImplementation((topic, callback) => {
			return callback('mockMessage');
		});
		(sincronizaCanonicoService as jest.Mock).mockRejectedValue(new Error('Erro de sincronização'));

		await consumeAllCanonicos();

		expect(logger.error).toHaveBeenCalledWith(
			'[APP :: Kafka] Erro ao sincronizar canônico Canonico1: Erro de sincronização',
		);
	});

	it('deve registrar o tempo de processamento para cada tópico', async () => {
		const mockCanonicos = [{ nome: 'Canonico1', topicos: ['topico1'] }];
		(getCanonicoService as jest.Mock).mockResolvedValue(mockCanonicos);
		(kafkaService.consume as jest.Mock).mockImplementation((topic, callback) => {
			return callback('mockMessage');
		});
		(sincronizaCanonicoService as jest.Mock).mockResolvedValue(null);

		await consumeAllCanonicos();

		expect(logger.info).toHaveBeenCalledWith(
			expect.stringContaining(
				'[APP :: Kafka] Tempo de processamento para o canônico Canonico1 no tópico topico1',
			),
		);
	});

	it('deve registrar uma mensagem de erro ao consumir um tópico específico', async () => {
		const mockCanonicos = [{ nome: 'Canonico1', topicos: ['topico1'] }];
		(getCanonicoService as jest.Mock).mockResolvedValue(mockCanonicos);
		(kafkaService.consume as jest.Mock).mockRejectedValue(new Error('Erro no consumo do tópico'));

		await consumeAllCanonicos();

		expect(logger.error).toHaveBeenCalledWith(
			'[APP :: Kafka] Erro ao consumir tópico topico1: Erro no consumo do tópico',
		);
	});
});
