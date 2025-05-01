import { supabase } from '../../lib/supabase';
import { Vehicle } from '../../types/vehicle';

const ITEMS_PER_PAGE = 6;

interface SearchParams {
  keyword: string;
  maker: string;
  year: string;
  mileage: string;
  sort: string;
}

interface FetchVehiclesResult {
  vehicles: Vehicle[];
  totalPages: number;
}

export const vehicleHandler = {
  async fetchVehicles(currentPage: number, searchParams: SearchParams): Promise<FetchVehiclesResult> {
    let query = supabase
      .from('vehicles')
      .select('*', { count: 'exact' });

    if (searchParams.keyword) {
      query = query.or(`name.ilike.%${searchParams.keyword}%,maker.ilike.%${searchParams.keyword}%`);
    }
    if (searchParams.maker) {
      query = query.eq('maker', searchParams.maker);
    }
    if (searchParams.year) {
      query = query.eq('year', parseInt(searchParams.year));
    }
    if (searchParams.mileage) {
      const [min, max] = searchParams.mileage.split('-').map(Number);
      query = query.gte('mileage', min).lte('mileage', max);
    }

    switch (searchParams.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    query = query.range(start, start + ITEMS_PER_PAGE - 1);

    const { data, error: queryError, count } = await query;

    if (queryError) throw queryError;

    const vehiclesWithImageUrls = data?.map(vehicle => ({
      ...vehicle,
      imageUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/vehicle-images/${vehicle.image_path}`
    })) || [];

    return {
      vehicles: vehiclesWithImageUrls,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
    };
  }
};