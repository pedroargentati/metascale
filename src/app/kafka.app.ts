import { getCanonicoService, sincronizaCanonicoService } from '../service/canonico';
import kafkaService from '../service/kafka/kafka-service';

/**
 * Consome todas as mensagens dos tópicos canônicos.
 */
async function consumeAllCanonicos() {
	const allCanonicos: Record<string, any>[] = await getCanonicoService();
	console.log('allCanonicos', allCanonicos);
	if (!allCanonicos?.length) return;

	// Consome mensagens de todos os tópicos canônicos
	for (const canonico of allCanonicos) {
		kafkaService.consume(canonico.nome, async (message: any) => {
			sincronizaCanonicoService(canonico, message);
		});

		kafkaService.consume('db1.VivoTest.Produtos', async (message: any) => {
			sincronizaCanonicoService(canonico, message);
		});
	}
}

export default consumeAllCanonicos;
