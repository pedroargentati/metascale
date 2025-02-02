import { Kafka, logLevel } from 'kafkajs';
import { generateAuthToken } from 'aws-msk-iam-sasl-signer-js';
import { IS_DEV } from '../../utils/constants.js';

async function oauthBearerTokenProvider(region: string) {
	//{ region, logger: console, awsDebugCreds: true}
	const authTokenResponse = await generateAuthToken({ region });
	return {
		value: authTokenResponse.token,
	};
}

let kafka: Kafka;

if (!IS_DEV) {
	const brokers = process.env.KAFKA_BROKERS?.split(',') || [];
	kafka = new Kafka({
		clientId: process.env.KAFKA_CLIENT_ID,
		brokers: brokers,
		logLevel: logLevel.INFO,
		ssl: true,
		sasl: {
			mechanism: 'oauthbearer',
			oauthBearerProvider: () => oauthBearerTokenProvider(process.env.AWS_REGION!),
		},
	});
} else {
	const brokers = process.env.KAFKA_BROKERS?.split(',') || [];
	kafka = new Kafka({
		clientId: process.env.KAFKA_CLIENT_ID,
		brokers: brokers,
		logLevel: logLevel.INFO,
	});
}

export default kafka;
