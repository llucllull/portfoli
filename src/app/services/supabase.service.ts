import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Ejemplo: obtener páginas
  async getPages() {
    const { data, error } = await this.supabase
      .from('pages')
      .select('*')
      .eq('active', true);
    if (error) throw error;
    return data;
  }
}
