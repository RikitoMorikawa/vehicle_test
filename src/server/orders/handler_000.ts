// src/server/orders/handler_000.ts
import { supabase } from "../../lib/supabase";

export interface OrderData {
  id: string;
  user_id: string;
  vehicle_id: string;
  status: number;
  order_date: string;
  approved_date?: string | null;
  rejected_date?: string | null;
  admin_user_id?: string | null;
  reject_reason?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleOrderStatus {
  isAvailable: boolean; // 注文可能かどうか
  userOrderStatus?: number; // ログインユーザーの注文状況（ある場合のみ）
  userOrderId?: string; // ログインユーザーの注文ID（ある場合のみ）
  rejectReason?: string; // 拒否理由（ユーザー自身の注文が拒否された場合のみ）
}

export const orderHandler = {
  // 注文作成
  async createOrder(userId: string, vehicleId: string): Promise<OrderData> {
    try {
      console.log("Creating order for user:", userId, "vehicle:", vehicleId);

      // 車両が販売済み（承認済み）かチェック
      const { data: approvedOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("status", 1) // approved
        .single();

      if (approvedOrder) {
        throw new Error("この車両は既に販売済みです");
      }

      // 他人の注文依頼中があるかチェック
      const { data: pendingOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("status", 0) // pending
        .single();

      if (pendingOrder) {
        throw new Error("この車両は他のお客様が注文依頼中です");
      }

      // 自分の既存注文（pending）があるかチェック
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .eq("vehicle_id", vehicleId)
        .eq("status", 0) // pending
        .single();

      if (existingOrder) {
        throw new Error("この車両は既に注文依頼済みです");
      }

      // 新規注文作成
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            vehicle_id: vehicleId,
            status: 0, // pending
            order_date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Order creation error:", error);
        throw new Error(`注文の作成に失敗しました: ${error.message}`);
      }

      console.log("Order created successfully:", data.id);
      return data;
    } catch (error) {
      console.error("Error in createOrder:", error);
      throw error;
    }
  },

  // 車両の注文状況チェック（ユーザー別表示制御）
  async getVehicleOrderStatus(vehicleId: string, currentUserId?: string): Promise<VehicleOrderStatus> {
    try {
      console.log("Checking order status for vehicle:", vehicleId, "user:", currentUserId);

      // 1. 承認済み（販売済み）注文があるかチェック
      const { data: approvedOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("status", 1) // approved
        .single();

      // 車両が販売済みの場合、誰でも注文不可
      if (approvedOrder) {
        console.log("Vehicle is already sold");
        return {
          isAvailable: false,
        };
      }

      // 2. 注文依頼中（pending）の注文があるかチェック
      const { data: pendingOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("status", 0) // pending
        .single();

      // 3. ログインユーザーの注文状況をチェック（ログイン時のみ）
      let userOrder = null;
      if (currentUserId) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("vehicle_id", vehicleId)
          .eq("user_id", currentUserId)
          .in("status", [0, 2, 3]) // pending, rejected, cancelled
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        userOrder = data;
      }

      // 4. 結果を返す
      if (userOrder) {
        // ログインユーザー自身の注文がある場合
        console.log("User has order with status:", userOrder.status);
        return {
          isAvailable: userOrder.status !== 0, // pending中は注文不可、rejected/cancelledは注文可能
          userOrderStatus: userOrder.status,
          userOrderId: userOrder.id,
          rejectReason: userOrder.reject_reason || undefined,
        };
      } else if (pendingOrder && currentUserId) {
        // 他人の注文がpending中で、自分は注文していない場合
        console.log("Other user has pending order");
        return {
          isAvailable: false, // 注文不可
        };
      } else {
        // 注文がない、または未ログインの場合
        console.log("Vehicle is available for order");
        return {
          isAvailable: true, // 注文可能
        };
      }
    } catch (error) {
      console.error("Error in getVehicleOrderStatus:", error);
      // エラー時は安全側に倒して注文不可とする
      return {
        isAvailable: false,
      };
    }
  },

  // 注文キャンセル（ユーザー用）
  async cancelOrder(orderId: string, userId: string): Promise<OrderData> {
    try {
      console.log("Cancelling order:", orderId, "by user:", userId);

      const { data, error } = await supabase
        .from("orders")
        .update({
          status: 3, // cancelled
        })
        .eq("id", orderId)
        .eq("user_id", userId) // 本人のみキャンセル可能
        .eq("status", 0) // pending状態のみキャンセル可能
        .select()
        .single();

      if (error) {
        console.error("Order cancellation error:", error);
        throw new Error(`注文のキャンセルに失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("キャンセル可能な注文が見つかりません");
      }

      console.log("Order cancelled successfully:", data.id);
      return data;
    } catch (error) {
      console.error("Error in cancelOrder:", error);
      throw error;
    }
  },

  // ユーザーの注文一覧取得
  async getUserOrders(userId: string): Promise<OrderData[]> {
    try {
      console.log("Fetching orders for user:", userId);

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          vehicles(maker, name, year, price, image_path)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("User orders fetch error:", error);
        throw new Error(`注文一覧の取得に失敗しました: ${error.message}`);
      }

      console.log("Found", data?.length || 0, "orders for user");
      return data || [];
    } catch (error) {
      console.error("Error in getUserOrders:", error);
      throw error;
    }
  },

  // 管理者用: 全注文一覧取得
  async getAllOrders(): Promise<OrderData[]> {
    try {
      console.log("Fetching all orders for admin");

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          users(company_name, user_name, phone, email),
          vehicles(maker, name, year, price, image_path)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("All orders fetch error:", error);
        throw new Error(`注文一覧の取得に失敗しました: ${error.message}`);
      }

      console.log("Found", data?.length || 0, "total orders");
      return data || [];
    } catch (error) {
      console.error("Error in getAllOrders:", error);
      throw error;
    }
  },

  // 注文承認（admin用）
  async approveOrder(orderId: string, adminUserId: string): Promise<OrderData> {
    try {
      console.log("Approving order:", orderId, "by admin:", adminUserId);

      const { data, error } = await supabase
        .from("orders")
        .update({
          status: 1, // approved
          approved_date: new Date().toISOString(),
          admin_user_id: adminUserId,
        })
        .eq("id", orderId)
        .eq("status", 0) // pending状態のみ承認可能
        .select()
        .single();

      if (error) {
        console.error("Order approval error:", error);
        throw new Error(`注文の承認に失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("承認可能な注文が見つかりません");
      }

      console.log("Order approved successfully:", data.id);
      return data;
    } catch (error) {
      console.error("Error in approveOrder:", error);
      throw error;
    }
  },

  // 注文拒否（admin用）
  async rejectOrder(orderId: string, adminUserId: string, rejectReason?: string): Promise<OrderData> {
    try {
      console.log("Rejecting order:", orderId, "by admin:", adminUserId);

      const { data, error } = await supabase
        .from("orders")
        .update({
          status: 2, // rejected
          rejected_date: new Date().toISOString(),
          admin_user_id: adminUserId,
          reject_reason: rejectReason || null,
        })
        .eq("id", orderId)
        .eq("status", 0) // pending状態のみ拒否可能
        .select()
        .single();

      if (error) {
        console.error("Order rejection error:", error);
        throw new Error(`注文の拒否に失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("拒否可能な注文が見つかりません");
      }

      console.log("Order rejected successfully:", data.id);
      return data;
    } catch (error) {
      console.error("Error in rejectOrder:", error);
      throw error;
    }
  },
};
