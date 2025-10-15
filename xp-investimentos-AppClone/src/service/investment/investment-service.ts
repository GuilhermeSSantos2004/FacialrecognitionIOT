import { AxiosClient } from "../axios-client";

export interface InvestmentRequest {
  logo?: string;
  title: string;
  description?: string;
  price: number;
  growth?: number;
  growthValue?: number;
  acoes: number;
  precoMedio?: number;
}

export interface InvestmentResponse {
  id: number;
  logo?: string;
  title: string;
  description?: string;
  price: string;
  growth?: string;
  growthValue?: string;
  acoes: number;
  precoMedio: number;
  valorTotal: number;
  resultado: number;
  resultadoPercentual: number;
  chartData?: any[];
}

export class InvestmentService {
  private basePath: string;
  private axiosClientWrapper: AxiosClient;

  constructor() {
    this.basePath = `/investments`;
    this.axiosClientWrapper = new AxiosClient();
  }

  async getInvestments(): Promise<InvestmentResponse[]> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.get(this.basePath);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar investimentos:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao buscar investimentos");
    }
  }

  async getInvestmentById(id: number): Promise<InvestmentResponse> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar investimento:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao buscar investimento");
    }
  }

  async createInvestment(investment: InvestmentRequest): Promise<InvestmentResponse> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.post(this.basePath, investment);
      return response.data.investment;
    } catch (error: any) {
      console.error("Erro ao criar investimento:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao criar investimento");
    }
  }

  async updateInvestment(id: number, data: Partial<InvestmentRequest>): Promise<InvestmentResponse> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
      return response.data.investment;
    } catch (error: any) {
      console.error("Erro ao atualizar investimento:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao atualizar investimento");
    }
  }

  async deleteInvestment(id: number): Promise<void> {
    try {
      const axiosInstance = await this.axiosClientWrapper.buildAxiosWithHeaders();
      await axiosInstance.delete(`${this.basePath}/${id}`);
    } catch (error: any) {
      console.error("Erro ao deletar investimento:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Erro ao deletar investimento");
    }
  }
}
