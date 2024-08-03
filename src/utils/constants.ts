export const CANONICO_STATUS_ATIVO: string = 'A';
export const CANONICO_STATUS_INATIVO: string = 'I';

export const CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT: string = 'DEFAULT';
export const CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM: string = 'CUSTOM';
export const enumCanonicoTipoPosProcessamento = new Map()
	.set(CANONICO_TIPO_POS_PROCESSAMENTO_DEFAULT, 'Padrão')
	.set(CANONICO_TIPO_POS_PROCESSAMENTO_CUSTOM, 'Customizado');
