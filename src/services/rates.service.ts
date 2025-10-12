
import apiClient from '@/lib/api/client';
import {
  CurrenciesResponse,
  ConversionPreview,
  ConversionPreviewRequest,
} from '@/lib/api/types';

export const ratesService = {
  /**
   * Get list of all available currencies
   */
  getCurrencies: async (): Promise<CurrenciesResponse> => {
    const response = await apiClient.get<never, any>('/rates/currencies');
    const data = response.data || response;
    return data as CurrenciesResponse;
  },

  /**
   * Preview a conversion without saving (get current rate and converted amount)
   */
  previewConversion: async (
    params: ConversionPreviewRequest
  ): Promise<ConversionPreview> => {
    const response = await apiClient.get<never, any>('/rates/convert', {
      params: {
        from: params.from,
        to: params.to,
        amount: params.amount,
      },
    });
    const data = response.data || response;
    return data as ConversionPreview;
  },
};

