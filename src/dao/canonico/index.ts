export const getCanonicoBanco = async (id: number): Promise<any> => {
  return {
    id,
    nome: 'canonico',
    descricao: 'canonico',
    data: new Date()
  }
};