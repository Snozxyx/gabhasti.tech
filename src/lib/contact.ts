import { supabase } from "@/integrations/supabase/client";

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  error?: string;
  row?: any;
}

export async function submitContactMessage(data: ContactFormData): Promise<ContactSubmissionResult> {
  try {
    // Get client IP and user agent for analytics (fail gracefully)
    let ipAddress: string | null = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (err) {
      // don't block submission due to IP lookup failure
      console.warn('Could not fetch IP address for contact message:', err);
      ipAddress = null;
    }

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;

    console.log('Submitting contact message:', { data, ipAddress, userAgent });

    // Use Supabase client for anonymous insert
    const { data: result, error } = await supabase
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit message',
      };
    }

    console.log('Contact message submitted successfully:', result);
    return {
      success: true,
      row: result,
    };
  } catch (error: any) {
    console.error('Contact submission exception:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}