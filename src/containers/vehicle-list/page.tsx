import React, { useState } from 'react';
import { vehicleService } from '../../services/vehicle/page';
import VehicleListComponent from '../../components/vehicle-list/page';

const VehicleListContainer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    maker: '',
    year: '',
    mileage: '',
    sort: 'newest'
  });

  const { vehicles, totalPages, isLoading, error } = vehicleService.useVehicles(currentPage, searchParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <VehicleListComponent
      vehicles={vehicles}
      loading={isLoading}
      error={error ? 'データの取得に失敗しました' : null}
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