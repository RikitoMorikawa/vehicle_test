// src / services / custom / car_makers / page.ts;
import { useQuery } from "@tanstack/react-query";
import { CarMaker } from "../../../types/db/car_makers";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { fetchCarMakers } from "../../../server/custom/car_makers/handler_000";

export const makerService = {
  // メーカー一覧を取得
  useMakers: () => {
    return useQuery<CarMaker[], Error>({
      queryKey: [...QUERY_KEYS.Car_MAKERS],
      queryFn: fetchCarMakers,
    });
  },
};
