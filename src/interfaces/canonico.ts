export interface ICanonico {
	statusCanonico?: string;
	chamadas: IChamada[];
	dependencias?: string[];
	descricao: string;
	versao: number;
	nome: string;
	tipoPosProcessamento: string;
	topicos?: string[];
	formatoChave: string;
}

export interface IChamada {
	ordem: number;
	nome: string;
	parametros: IParametro[];
	url: string;
	descricao: string;
}

export interface IParametro {
	tipoDado: string;
	nome: string;
	tipo: string;
}
