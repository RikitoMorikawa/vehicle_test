import React, { useState } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { Accessory, EstimateError } from "../../../types/estimate/page";
import { Plus, Trash2 } from "lucide-react";

// AccessoriesInfo専用の型定義
interface AccessoriesInfoProps {
  accessories: Accessory[];
  onInputChange: (action: "add" | "remove", value: Accessory | number) => void;
  errors?: EstimateError | null;
}

const AccessoriesInfo: React.FC<AccessoriesInfoProps> = ({ accessories, onInputChange, errors }) => {
  const [newAccessory, setNewAccessory] = useState<Accessory>({ name: "", price: 0 });

  const handleAddAccessory = () => {
    if (newAccessory.name && newAccessory.price > 0) {
      onInputChange("add", { ...newAccessory });
      setNewAccessory({ name: "", price: 0 });
    }
  };

  const handleRemoveAccessory = (index: number) => {
    onInputChange("remove", index);
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">付属品・特別仕様</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="品名"
            value={newAccessory.name}
            onChange={(e) => setNewAccessory({ ...newAccessory, name: e.target.value })}
            error={errors?.accessories_name}
          />
          <Input
            label="価格"
            type="number"
            value={newAccessory.price}
            onChange={(e) => setNewAccessory({ ...newAccessory, price: parseInt(e.target.value) })}
            error={errors?.accessories_price}
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={handleAddAccessory} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            追加
          </Button>
        </div>

        {accessories.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">登録済み付属品</h3>
            <div className="space-y-2">
              {accessories.map((accessory, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium">{accessory.name}</span>
                    <span className="ml-4 text-gray-600">¥{accessory.price.toLocaleString()}</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveAccessory(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesInfo;
