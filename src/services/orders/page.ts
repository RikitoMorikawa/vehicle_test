// src/services/orders/page.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { orderHandler, type OrderData, type VehicleOrderStatus } from "../../server/orders/handler_000";
import { QUERY_KEYS } from "../../constants/queryKeys";

// 注文作成のフック
function useCreateOrder() {
  return useMutation({
    mutationFn: ({ userId, vehicleId }: { userId: string; vehicleId: string }) => orderHandler.createOrder(userId, vehicleId),
  });
}

// 注文キャンセルのフック
function useCancelOrder() {
  return useMutation({
    mutationFn: ({ orderId, userId }: { orderId: string; userId: string }) => orderHandler.cancelOrder(orderId, userId),
  });
}

// 車両の注文状況取得のフック
function useVehicleOrderStatus(vehicleId: string, userId?: string) {
  return useQuery<VehicleOrderStatus, Error>({
    queryKey: [...QUERY_KEYS.VEHICLE_ORDER_STATUS, vehicleId, userId],
    queryFn: () => orderHandler.getVehicleOrderStatus(vehicleId, userId),
    enabled: !!vehicleId,
    refetchOnWindowFocus: true, // タブ切り替え時に再取得
    refetchInterval: 30000, // 30秒ごとに自動更新
  });
}

// ユーザーの注文一覧取得のフック
function useUserOrders(userId: string) {
  return useQuery<OrderData[], Error>({
    queryKey: [...QUERY_KEYS.ORDERS, userId],
    queryFn: () => orderHandler.getUserOrders(userId),
    enabled: !!userId,
  });
}

// 管理者用: 全注文一覧取得のフック
function useAllOrders() {
  return useQuery<OrderData[], Error>({
    queryKey: [...QUERY_KEYS.ORDERS],
    queryFn: () => orderHandler.getAllOrders(),
  });
}

// 注文承認のフック（admin用）
function useApproveOrder() {
  return useMutation({
    mutationFn: ({ orderId, adminUserId }: { orderId: string; adminUserId: string }) => orderHandler.approveOrder(orderId, adminUserId),
  });
}

// 注文拒否のフック（admin用）
function useRejectOrder() {
  return useMutation({
    mutationFn: ({ orderId, adminUserId, rejectReason }: { orderId: string; adminUserId: string; rejectReason?: string }) =>
      orderHandler.rejectOrder(orderId, adminUserId, rejectReason),
  });
}

// 直接API呼び出し用の関数
export const orderService = {
  useCreateOrder,
  useCancelOrder,
  useVehicleOrderStatus,
  useUserOrders,
  useAllOrders,
  useApproveOrder,
  useRejectOrder,

  // 直接呼び出し用
  async createOrder(userId: string, vehicleId: string): Promise<OrderData> {
    return orderHandler.createOrder(userId, vehicleId);
  },

  async getVehicleOrderStatus(vehicleId: string, userId?: string): Promise<VehicleOrderStatus> {
    return orderHandler.getVehicleOrderStatus(vehicleId, userId);
  },

  async cancelOrder(orderId: string, userId: string): Promise<OrderData> {
    return orderHandler.cancelOrder(orderId, userId);
  },

  async getUserOrders(userId: string): Promise<OrderData[]> {
    return orderHandler.getUserOrders(userId);
  },

  async getAllOrders(): Promise<OrderData[]> {
    return orderHandler.getAllOrders();
  },

  async approveOrder(orderId: string, adminUserId: string): Promise<OrderData> {
    return orderHandler.approveOrder(orderId, adminUserId);
  },

  async rejectOrder(orderId: string, adminUserId: string, rejectReason?: string): Promise<OrderData> {
    return orderHandler.rejectOrder(orderId, adminUserId, rejectReason);
  },
};
