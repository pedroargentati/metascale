import { CumulativeIntegrationError } from '../../../errors/CumulativeIntegrationError';
import { IntegrationError } from '../../../errors/IntegrationError';
import { validateCanonico } from '../../../service/canonico/validations/validations';

describe('validateCanonico', () => {
	it('should throw CumulativeIntegrationError if data is null', () => {
		expect(() => validateCanonico(null)).toThrow(CumulativeIntegrationError);
	});

	it('should throw IntegrationError if data is missing required fields', () => {
		const data = {
			field1: 'value1',
			field2: 'value2',
		};

		expect(() => validateCanonico(data)).toThrow(IntegrationError);
	});

	it('should not throw any error if data is valid', () => {
		const data = {
			field1: 'value1',
			field2: 'value2',
			field3: 'value3',
		};

		expect(() => validateCanonico(data)).not.toThrow();
	});
});
