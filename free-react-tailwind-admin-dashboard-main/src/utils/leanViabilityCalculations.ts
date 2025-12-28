export interface LeanViability {
  title?: string;
  version?: string;
  last_updated?: string;
  time_horizon?: {
    duration?: number;
    unit?: string;
  };
  success_criteria?: {
    annual_revenue?: {
      amount?: number;
      currency?: string;
    };
  };
  calculations?: {
    annual_revenue_per_customer?: {
      amount?: number;
      currency?: string;
      basis?: string;
    };
    required_customers?: {
      count?: number;
      formula?: string;
    };
    customer_acquisition_rate?: {
      rate?: number;
      period?: string;
      formula?: string;
    };
    monthly_acquisition_target?: {
      rate?: number;
      period?: string;
      formula?: string;
    };
    customer_lifetime_value?: {
      years?: number;
      amount?: number;
      currency?: string;
      formula?: string;
    };
    churn_rate?: {
      monthly_rate?: number;
      formula?: string;
    };
    conversion_rate?: {
      rate?: number;
      basis?: string;
    };
    monthly_visitors?: {
      rate?: number;
      period?: string;
      formula?: string;
    };
  };
}

/**
 * Calculate derived values based on input parameters for Lean Viability analysis
 */
export const calculateLeanViabilityMetrics = (inputData: LeanViability): LeanViability => {
  const updatedData = { ...inputData };

  // Ensure calculations object exists
  if (!updatedData.calculations) {
    updatedData.calculations = {};
  }

  // Calculate Required Customers: Annual Revenue Target ÷ ARPU
  const annualRevenue = updatedData.success_criteria?.annual_revenue?.amount;
  const arpu = updatedData.calculations.annual_revenue_per_customer?.amount;

  if (annualRevenue && arpu && arpu > 0) {
    const requiredCustomers = Math.ceil(annualRevenue / arpu);
    updatedData.calculations.required_customers = {
      count: requiredCustomers,
      formula: "Annual revenue target / Annual revenue per customer"
    };
  }

  // Calculate Customer Lifetime Value: ARPU × Lifetime
  const lifetime = updatedData.calculations.customer_lifetime_value?.years || 3;
  if (arpu && lifetime) {
    const clv = arpu * lifetime;
    updatedData.calculations.customer_lifetime_value = {
      ...updatedData.calculations.customer_lifetime_value,
      amount: clv,
      currency: "USD",
      formula: "Annual revenue per customer * Customer lifetime"
    };
  }

  // Calculate Monthly Churn Rate: 1 / (12 * Customer Lifetime)
  if (lifetime && lifetime > 0) {
    const monthlyChurnRate = 1 / (12 * lifetime);
    updatedData.calculations.churn_rate = {
      monthly_rate: monthlyChurnRate,
      formula: "1 / (12 * Customer lifetime)"
    };
  }

  // Calculate Monthly Acquisition Target: Required customers × Monthly churn rate
  const requiredCustomers = updatedData.calculations.required_customers?.count;
  const monthlyChurnRate = updatedData.calculations.churn_rate?.monthly_rate || 0;

  if (requiredCustomers && monthlyChurnRate) {
    const monthlyTarget = Math.ceil(requiredCustomers * monthlyChurnRate);
    updatedData.calculations.monthly_acquisition_target = {
      rate: monthlyTarget,
      period: "month",
      formula: "Required customers × Monthly churn rate"
    };
  }

  return updatedData;
};