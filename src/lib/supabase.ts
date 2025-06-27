import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create admin client for user management operations (only available server-side)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase; // Fallback to regular client if service key not available

// Database types for businesses table (Canadian Business Registry data)
export interface BusinessData {
  id?: number;
  created_at?: string;
  updated_at?: string;

  // Canadian Business Registry Core Fields
  mras_id: string;
  company_name: string;
  business_number?: string;
  juri_id?: string;

  // Location Information
  registry_source?: string;
  jurisdiction?: string;
  reg_office_city?: string;
  city?: string;
  reg_office_province?: string;

  // Business Status and Dates
  status_state?: string;
  status_date?: string;
  status_notes?: string;
  date_incorporated?: string;
  display_date?: string;

  // Business Type and Classification
  entity_type?: string;
  mras_entity_type?: string;

  // Additional Fields
  alternate_names?: string[];
  text_fields?: string[];
  score?: number;
  hierarchy?: string;
  data_source?: string;
  version_number?: number;

  // Derived/Computed Fields
  business_age_category?: string;
  estimated_business_type?: string;

  // Registry API Response
  raw_registry_data?: any;

  // Search and Usage Tracking
  search_query?: string;
  times_selected?: number;
  last_selected_at?: string;
}

// Database types for our applications table
export interface ApplicationData {
  id?: number;
  created_at?: string;
  updated_at?: string;

  // Step 1: Loan Type
  loan_type: string;

  // Step 2: Business Owner
  is_business_owner: string;

  // Step 3: Monthly Sales
  monthly_sales: string;

  // Step 4: Existing Loans
  has_existing_loans: string;
  total_loan_amount?: string;

  // Step 5: Business Search
  business_name: string;
  business_search_verified?: string;

  // Step 6: Bank Connection
  bank_connected?: string;
  bank_connection_method?: string;

  // Step 7: Personal Information
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  title?: string;
  ssn_last_4?: string;

  // Step 8: Funding Amount
  funding_amount: string;
  funding_timeline: string;

  // Step 9: Funding Purpose
  funding_purpose: string;

  // Step 10: Business Details
  business_type: string;
  number_of_employees: string;

  // Step 11: Financial Information
  annual_revenue: string;
  cash_flow: string;
  credit_score: string;

  // Step 12: Bank Information
  bank_connection_completed?: boolean;
  skipped_bank_connection?: boolean;

  // Step 13: Additional Details
  business_address: string;
  business_phone: string;
  website_url?: string;
  additional_info?: string;

  // Step 14: Review & Submit
  agrees_to_terms: boolean;
  authorizes_credit_check?: boolean;

  // Application Status
  status?: string;
  submitted_at?: string;
  ip_address?: string;

  // Business Reference
  business_id?: number;

  // User Reference
  user_id?: string;
}

// Database types for users table (campaign management - no passwords)
export interface UserData {
  id?: string;
  created_at?: string;
  updated_at?: string;

  // Personal Information
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;

  // Business Role
  role_in_business?: string;
  ownership_percentage?: number;

  // Address Information
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  postal_code?: string;

  // Campaign Tracking
  source?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;

  // Preferences
  email_marketing_consent?: boolean;
  sms_marketing_consent?: boolean;

  // Status
  status?: 'active' | 'inactive' | 'unsubscribed';

  // Metadata
  ip_address?: string;
  user_agent?: string;
}

// Function to save application data to Supabase
export async function saveApplication(applicationData: ApplicationData) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select();

  if (error) {
    console.error('Error saving application:', error);
    throw error;
  }

  return data[0];
}

// Function to update application data
export async function updateApplication(
  id: number,
  applicationData: Partial<ApplicationData>
) {
  const { data, error } = await supabase
    .from('applications')
    .update({ ...applicationData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating application:', error);
    throw error;
  }

  return data[0];
}

// Function to get application by ID
export async function getApplication(id: number) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching application:', error);
    throw error;
  }

  return data;
}

// Business management functions

// Save business data from Canadian Business Registry
export async function saveBusiness(businessData: BusinessData) {
  const { data, error } = await supabase
    .from('businesses')
    .insert([businessData])
    .select();

  if (error) {
    console.error('Error saving business:', error);
    throw error;
  }

  return data[0];
}

// Find business by MRAS ID
export async function findBusinessByMrasId(mrasId: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('mras_id', mrasId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found
    console.error('Error finding business:', error);
    throw error;
  }

  return data;
}

// Save manual business entry (when user can't find business in registry)
export async function saveManualBusiness(businessName: string) {
  const manualBusinessData = {
    mras_id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    company_name: businessName,
    business_number: null,
    juri_id: null,
    registry_source: 'MANUAL',
    jurisdiction: 'MANUAL',
    reg_office_city: null,
    city: null,
    reg_office_province: null,
    status_state: 'Active',
    status_date: new Date().toISOString().split('T')[0],
    status_notes: 'Manually entered by user',
    date_incorporated: null,
    display_date: null,
    entity_type: 'Manual Entry',
    mras_entity_type: null,
    alternate_names: null,
    text_fields: null,
    score: null,
    hierarchy: null,
    data_source: 'MANUAL',
    version_number: 1,
    business_age_category: 'Unknown',
    estimated_business_type: 'professional-services',
    search_query: `Manual entry: ${businessName}`,
    times_selected: 1,
    last_selected_at: new Date().toISOString(),
    raw_registry_data: { source: 'manual_entry', business_name: businessName },
  };

  try {
    const { data, error } = await supabase
      .from('businesses')
      .insert([manualBusinessData])
      .select();

    if (error) {
      console.error('Error saving manual business:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Failed to save manual business entry:', error);
    throw error;
  }
}

// Save or update business from Canadian Business Registry data
export async function saveOrUpdateBusiness(
  registryBusiness: any,
  searchQuery: string
) {
  try {
    // Check if business already exists
    const existingBusiness = await findBusinessByMrasId(
      registryBusiness.MRAS_ID
    );

    if (existingBusiness) {
      // Update existing business
      const { data, error } = await supabase
        .from('businesses')
        .update({
          times_selected: (existingBusiness.times_selected || 0) + 1,
          last_selected_at: new Date().toISOString(),
          raw_registry_data: registryBusiness,
          updated_at: new Date().toISOString(),
        })
        .eq('mras_id', registryBusiness.MRAS_ID)
        .select();

      if (error) throw error;
      return data[0];
    } else {
      // Create new business record
      const businessData: BusinessData = {
        mras_id: registryBusiness.MRAS_ID,
        company_name: registryBusiness.Company_Name,
        business_number: registryBusiness.BN,
        juri_id: registryBusiness.Juri_ID,

        registry_source: registryBusiness.Registry_Source,
        jurisdiction: registryBusiness.Jurisdiction,
        reg_office_city: registryBusiness.Reg_office_city,
        city: registryBusiness.City,
        reg_office_province: registryBusiness.Reg_office_province,

        status_state: registryBusiness.Status_State,
        status_date: registryBusiness.Status_Date,
        status_notes: registryBusiness.Status_Notes,
        date_incorporated: registryBusiness.Date_Incorporated,
        display_date: registryBusiness.Display_Date,

        entity_type: registryBusiness.Entity_Type,
        mras_entity_type: registryBusiness.MRAS_Entity_Type,

        alternate_names: registryBusiness.Alternate_Name,
        text_fields: registryBusiness.text,
        score: registryBusiness.score,
        hierarchy: registryBusiness.hierarchy,
        data_source: registryBusiness.Data_Source,
        version_number: registryBusiness._version_,

        raw_registry_data: registryBusiness,
        search_query: searchQuery,
        times_selected: 1,
        last_selected_at: new Date().toISOString(),
      };

      return await saveBusiness(businessData);
    }
  } catch (error) {
    console.error('Error saving/updating business:', error);
    throw error;
  }
}

// Get business with applications
export async function getBusinessWithApplications(businessId: number) {
  const { data, error } = await supabase
    .from('businesses')
    .select(
      `
      *,
      applications (*)
    `
    )
    .eq('id', businessId)
    .single();

  if (error) {
    console.error('Error fetching business with applications:', error);
    throw error;
  }

  return data;
}

// User management functions for campaign tracking

// Function to create a user
export async function createUser(userData: UserData) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data[0];
}

// Function to update user data
export async function updateUser(id: string, userData: Partial<UserData>) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  return data[0];
}

// Function to get user by ID
export async function getUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return data;
}

// Function to find user by email
export async function findUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found
    console.error('Error finding user by email:', error);
    throw error;
  }

  return data;
}

// Function to create or update user (upsert by email)
export async function upsertUser(userData: UserData) {
  try {
    // Check if user exists by email
    const existingUser = await findUserByEmail(userData.email);

    if (existingUser) {
      // Update existing user
      return await updateUser(existingUser.id, userData);
    } else {
      // Create new user
      return await createUser({
        ...userData,
        email: userData.email.toLowerCase(),
        source: userData.source || 'referral_application',
        status: userData.status || 'active',
      });
    }
  } catch (error) {
    console.error('Error upserting user:', error);
    throw error;
  }
}

// Function to get user with applications
export async function getUserWithApplications(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      applications (*)
    `
    )
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user with applications:', error);
    throw error;
  }

  return data;
}

// Function to update application with user ID
export async function linkApplicationToUser(
  applicationId: number,
  userId: string
) {
  const { data, error } = await supabase
    .from('applications')
    .update({ user_id: userId, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .select();

  if (error) {
    console.error('Error linking application to user:', error);
    throw error;
  }

  return data[0];
}
