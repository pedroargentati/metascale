import { Kafka, logLevel } from 'kafkajs';
import { generateAuthToken } from 'aws-msk-iam-sasl-signer-js';
import { IS_DEV } from '../../utils/constants';

async function oauthBearerTokenProvider(region: string) {
	const authTokenResponse = await generateAuthToken({ region });
	return {
		value: authTokenResponse.token,
	};
}

let kafka: Kafka;

if (!IS_DEV) {
	kafka = new Kafka({
		clientId: process.env.KAFKA_CLIENT_ID,
		brokers: process.env.KAFKA_BROKERS!.split(','),
		logLevel: logLevel.INFO,
		ssl: true,
		sasl: {
			mechanism: 'oauthbearer',
			oauthBearerProvider: () => oauthBearerTokenProvider(process.env.AWS_REGION!),
		},
	});
} else {
	kafka = new Kafka({
		clientId: process.env.KAFKA_CLIENT_ID,
		brokers: process.env.KAFKA_BROKERS!.split(','),
		logLevel: logLevel.INFO,
	});
}

export default kafka;
