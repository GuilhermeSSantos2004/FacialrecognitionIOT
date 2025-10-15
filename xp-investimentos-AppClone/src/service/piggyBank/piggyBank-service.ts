import { AxiosClient } from "../axios-client";

export interface PiggyBankRequest {
  nome: string;
  meta: number;
  imagem?: string;
  tipo?: string;
}

export interface PiggyBankResponse {
  id: number;
  nome: string;
  valor: number;
  imagem?: string;
  meta: number;
  progresso: number;
  descricaoMeta: string;
  dadosGrafico: number[];
  labelsGrafico: string[];
  resumo: {
    saldoInicial: number;
    entradas: number;
    saidas: number;
    diferenca: number;
  };
  tipo?: string;
}

export interface PiggyBankUpdateRequest {
  valor: number;
  operacao: 'adicionar' | 'retirar';
}

export class PiggyBankService {
  private basePath: string;
  private axiosClientWrapper: AxiosClient;

  constructor() {
    this.basePath = `/piggy-banks`;
    this.axiosClientWrapper = new AxiosClient();
  }

  async getPiggyBanks(): Promise<PiggyBankResponse[]> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.get(this.basePath);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar cofrinhos:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao buscar cofrinhos");
    }
  }

  async getPiggyBankById(id: number): Promise<PiggyBankResponse> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar cofrinho:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao buscar cofrinho");
    }
  }

  async createPiggyBank(piggyBank: PiggyBankRequest): Promise<PiggyBankResponse> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.post(this.basePath, piggyBank);
      return response.data.piggyBank;
    } catch (error: any) {
      console.error("Erro ao criar cofrinho:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao criar cofrinho");
    }
  }

  async updatePiggyBank(id: number, data: PiggyBankUpdateRequest): Promise<PiggyBankResponse> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
      return response.data.piggyBank;
    } catch (error: any) {
      console.error("Erro ao atualizar cofrinho:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao atualizar cofrinho");
    }
  }

  async deletePiggyBank(id: number): Promise<void> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      await axiosInstance.delete(`${this.basePath}/${id}`);
    } catch (error: any) {
      console.error("Erro ao deletar cofrinho:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao deletar cofrinho");
    }
  }

  async addMoney(id: number, valor: number): Promise<PiggyBankResponse> {
    return this.updatePiggyBank(id, { valor, operacao: 'adicionar' });
  }

  async withdrawMoney(id: number, valor: number): Promise<PiggyBankResponse> {
    return this.updatePiggyBank(id, { valor, operacao: 'retirar' });
  }
}
