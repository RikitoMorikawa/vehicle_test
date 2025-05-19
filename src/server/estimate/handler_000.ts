// src / server / estimate / handler_001.ts;
import { supabase } from "../../lib/supabase";
import { Vehicle } from "../../types/db/vehicle";
import type { EstimateFormData } from "../../types/estimate/page";

export const estimateHandler = {
  async fetchVehicle(id: string): Promise<Vehicle> {
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async createEstimate(data: { vehicleId: string } & EstimateFormData): Promise<void> {
    const { vehicleId, tradeIn, salesPrice, loanCalculation, processingFees, legalFees, taxInsuranceFees, accessories } = data;

    // Start a transaction
    const { error: tradeInError } = await supabase.from("trade_in_vehicles").insert([tradeIn]);

    if (tradeInError) throw tradeInError;

    const { error: salesPriceError } = await supabase.from("sales_prices").insert([{ ...salesPrice, vehicle_id: vehicleId }]);

    if (salesPriceError) throw salesPriceError;

    const { error: loanCalcError } = await supabase.from("loan_calculations").insert([loanCalculation]);

    if (loanCalcError) throw loanCalcError;

    const { error: processingFeesError } = await supabase.from("processing_fees").insert([processingFees]);

    if (processingFeesError) throw processingFeesError;

    const { error: legalFeesError } = await supabase.from("legal_fees").insert([legalFees]);

    if (legalFeesError) throw legalFeesError;

    const { error: taxInsuranceFeesError } = await supabase.from("tax_insurance_fees").insert([taxInsuranceFees]);

    if (taxInsuranceFeesError) throw taxInsuranceFeesError;

    if (accessories.length > 0) {
      const { error: accessoriesError } = await supabase.from("accessories").insert(accessories);

      if (accessoriesError) throw accessoriesError;
    }
  },
};