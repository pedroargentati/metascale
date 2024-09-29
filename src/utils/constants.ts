export const IS_DEV: boolean = process.env.DEV_MODE === 'true';

export const CANONICO_STATUS_ATIVO: string = 'A';
export const CANONICO_STATUS_INATIVO: string = 'I';

export const CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT: string = 'DEFAULT';
export const CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM: string = 'CUSTOM';

export const INSTANCE_TYPE_API: string = 'API';
export const INSTANCE_TYPE_KAFKA: string = 'KAFKA';

export const LOG_TYPE_FILE: string = 'FILE';
export const LOG_TYPE_CLOUDWATCH: string = 'CLOUDWATCH';

export const enumCanonicoTipoPosProcessamento = new Map()
	.set(CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT, 'Padrão')
	.set(CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM, 'Customizado');
