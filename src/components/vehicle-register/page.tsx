// src / components / vehicle - register / page.tsx;
import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import Input from "../ui/Input";
import Button from "../ui/Button";
import type { RegisterVehicleComponentProps } from "../../types/vehicle-register/page";

const VehicleRegisterComponent: React.FC<RegisterVehicleComponentProps> = ({ formData, isLoading, error, onInputChange, onSubmit, onCancel }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">車両登録</h1>
              </div>

              {error?.general && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-600">{error.general}</p>
                </div>
              )}

              <form onSubmit={onSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="車両ID" name="vehicle_id" value={formData.vehicle_id} onChange={onInputChange} error={error?.vehicle_id} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">メーカー</label>
                    <select
                      name="maker"
                      value={formData.maker}
                      onChange={onInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="トヨタ">トヨタ</option>
                      <option value="日産">日産</option>
                      <option value="ホンダ">ホンダ</option>
                      <option value="マツダ">マツダ</option>
                      <option value="スバル">スバル</option>
                    </select>
                    {error?.maker && <p className="mt-1 text-sm text-red-600">{error.maker}</p>}
                  </div>
                  <Input label="車名" name="name" value={formData.name} onChange={onInputChange} error={error?.name} required />
                  <Input label="型式" name="model_code" value={formData.model_code} onChange={onInputChange} error={error?.model_code} required />
                  <Input label="年式" name="year" type="number" value={formData.year} onChange={onInputChange} error={error?.year} required />
                  <Input label="走行距離 (km)" name="mileage" type="number" value={formData.mileage} onChange={onInputChange} error={error?.mileage} required />
                  <Input label="価格 (円)" name="price" type="number" value={formData.price} onChange={onInputChange} error={error?.price} required />
                  <Input label="ボディカラー" name="color" value={formData.color} onChange={onInputChange} error={error?.color} required />
                  <Input
                    label="排気量 (cc)"
                    name="engine_size"
                    type="number"
                    value={formData.engine_size}
                    onChange={onInputChange}
                    error={error?.engine_size}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">シフト</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={onInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="AT">AT</option>
                      <option value="CVT">CVT</option>
                      <option value="MT">MT</option>
                    </select>
                    {error?.transmission && <p className="mt-1 text-sm text-red-600">{error.transmission}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">駆動方式</label>
                    <select
                      name="drive_system"
                      value={formData.drive_system}
                      onChange={onInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="FF">FF</option>
                      <option value="FR">FR</option>
                      <option value="4WD">4WD</option>
                    </select>
                    {error?.drive_system && <p className="mt-1 text-sm text-red-600">{error.drive_system}</p>}
                  </div>
                  <Input
                    label="車検満了日"
                    name="inspection_date"
                    type="date"
                    value={formData.inspection_date}
                    onChange={onInputChange}
                    error={error?.inspection_date}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    キャンセル
                  </Button>
                  <Button type="submit" isLoading={isLoading}>
                    登録
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleRegisterComponent;
