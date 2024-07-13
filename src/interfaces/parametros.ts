export interface IParametro {
	nome: string;
	tipo: 'path' | 'query';
	tipoDado: 'string' | 'number' | 'boolean';
}

export interface IParametros {
	parametros: IParametro[];
}
