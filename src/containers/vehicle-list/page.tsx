import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Vehicle } from '../../types/vehicle';
import VehicleListComponent from '../../components/vehicle-list/page';

const ITEMS_PER_PAGE = 6;

const VehicleListContainer: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    maker: '',
    year: '',
    mileage: '',
    sort: 'newest'
  });

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const fetchVehicles = async () => {
    try {
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

      const { data, error, count } = await query;

      if (error) throw error;

      const vehiclesWithImageUrls = data?.map(vehicle => ({
        ...vehicle,
        imageUrl: getImageUrl(vehicle.image_path)
      })) || [];

      setVehicles(vehiclesWithImageUrls);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('車両データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [currentPage, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVehicles();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <VehicleListComponent
      vehicles={vehicles}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      searchParams={searchParams}
      onSearch={handleSearch}
      onInputChange={handleInputChange}
      onPageChange={setCurrentPage}
    />
  );
};

export default VehicleListContainer;