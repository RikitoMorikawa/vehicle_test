// src/server/orders/handler_000.ts - デバッグログ付きバージョン
import { supabase } from "../../lib/supabase";

export interface OrderData {
  id: string;
  user_id: string;
  vehicle_id: string;
  status: number; // 0: pending, 1: approved, 2: rejected, 3: cancelled
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
  // 車両の注文状況チェック（ユーザー別表示制御）
  async getVehicleOrderStatus(vehicleId: string, currentUserId?: string): Promise<VehicleOrderStatus> {
    try {
      console.log("🔍 DEBUG: Starting getVehicleOrderStatus");
      console.log("🔍 DEBUG: Vehicle ID:", vehicleId);
      console.log("🔍 DEBUG: User ID:", currentUserId);

      // まず簡単なクエリでテスト
      console.log("🔍 DEBUG: Testing basic query...");
      const { data: testData, error: testError } = await supabase.from("orders").select("count", { count: "exact" });

      console.log("🔍 DEBUG: Basic query result:", { data: testData, error: testError });

      if (testError) {
        console.error("🚨 DEBUG: Basic query failed:", testError);
        return { isAvailable: false };
      }

      // 1. 承認済み（販売済み）注文があるかチェック
      console.log("🔍 DEBUG: Checking approved orders...");
      const { data: approvedOrders, error: approvedError } = await supabase.from("orders").select("*").eq("vehicle_id", vehicleId).eq("status", 1); // approved

      console.log("🔍 DEBUG: Approved query result:", {
        data: approvedOrders,
        error: approvedError,
        count: approvedOrders?.length,
      });

      if (approvedError) {
        console.error("🚨 DEBUG: Approved query error:", approvedError);
        console.error("🚨 DEBUG: Error details:", {
          message: approvedError.message,
          details: approvedError.details,
          hint: approvedError.hint,
          code: approvedError.code,
        });
      }

      const approvedOrder = approvedOrders?.[0];
      if (approvedOrder) {
        console.log("✅ DEBUG: Vehicle is already sold");
        return { isAvailable: false };
      }

      // 2. 注文依頼中（pending）の注文があるかチェック
      console.log("🔍 DEBUG: Checking pending orders...");
      const { data: pendingOrders, error: pendingError } = await supabase.from("orders").select("*").eq("vehicle_id", vehicleId).eq("status", 0); // pending

      console.log("🔍 DEBUG: Pending query result:", {
        data: pendingOrders,
        error: pendingError,
        count: pendingOrders?.length,
      });

      if (pendingError) {
        console.error("🚨 DEBUG: Pending query error:", pendingError);
      }

      const pendingOrder = pendingOrders?.[0];

      // 3. ログインユーザーの注文状況をチェック（ログイン時のみ）
      let userOrder = null;
      if (currentUserId) {
        console.log("🔍 DEBUG: Checking user orders...");
        const { data: userOrders, error: userError } = await supabase
          .from("orders")
          .select("*")
          .eq("vehicle_id", vehicleId)
          .eq("user_id", currentUserId)
          .in("status", [0, 2, 3]) // pending, rejected, cancelled
          .order("created_at", { ascending: false })
          .limit(1);

        console.log("🔍 DEBUG: User query result:", {
          data: userOrders,
          error: userError,
          count: userOrders?.length,
        });

        if (userError) {
          console.error("🚨 DEBUG: User query error:", userError);
        }

        userOrder = userOrders?.[0];
      }

      // 4. 結果を返す
      console.log("🔍 DEBUG: Final decision logic...");
      console.log("🔍 DEBUG: userOrder:", userOrder);
      console.log("🔍 DEBUG: pendingOrder:", pendingOrder);
      console.log("🔍 DEBUG: currentUserId:", currentUserId);

      if (userOrder) {
        console.log("✅ DEBUG: User has order with status:", userOrder.status);
        const result = {
          isAvailable: userOrder.status !== 0,
          userOrderStatus: userOrder.status,
          userOrderId: userOrder.id,
          rejectReason: userOrder.reject_reason || undefined,
        };
        console.log("✅ DEBUG: Returning user order result:", result);
        return result;
      } else if (pendingOrder && currentUserId) {
        console.log("✅ DEBUG: Other user has pending order");
        return { isAvailable: false };
      } else {
        console.log("✅ DEBUG: Vehicle is available for order");
        return { isAvailable: true };
      }
    } catch (error) {
      console.error("🚨 DEBUG: Unexpected error in getVehicleOrderStatus:", error);
      return { isAvailable: false };
    }
  },

  // 注文作成
  async createOrder(userId: string, vehicleId: string): Promise<OrderData> {
    try {
      console.log("🔍 DEBUG: Creating order for user:", userId, "vehicle:", vehicleId);

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

      console.log("🔍 DEBUG: Create order result:", { data, error });

      if (error) {
        console.error("🚨 DEBUG: Order creation error:", error);
        throw new Error(`注文の作成に失敗しました: ${error.message}`);
      }

      console.log("✅ DEBUG: Order created successfully:", data.id);
      return data;
    } catch (error) {
      console.error("🚨 DEBUG: Error in createOrder:", error);
      throw error;
    }
  },

  // 注文キャンセル（ユーザー用）
  async cancelOrder(orderId: string, userId: string): Promise<OrderData> {
    try {
      console.log("🔍 DEBUG: Cancelling order:", orderId, "by user:", userId);

      const { data, error } = await supabase
        .from("orders")
        .update({ status: 3 }) // cancelled
        .eq("id", orderId)
        .eq("user_id", userId)
        .eq("status", 0) // pending状態のみキャンセル可能
        .select()
        .single();

      console.log("🔍 DEBUG: Cancel order result:", { data, error });

      if (error) {
        console.error("🚨 DEBUG: Cancel order error:", error);
        throw new Error(`注文のキャンセルに失敗しました: ${error.message}`);
      }

      if (!data) {
        throw new Error("キャンセル対象の注文が見つかりません");
      }

      console.log("✅ DEBUG: Order cancelled successfully:", data.id);
      return data;
    } catch (error) {
      console.error("🚨 DEBUG: Error in cancelOrder:", error);
      throw error;
    }
  },

  // その他のメソッドは省略（必要に応じて追加）
  async getUserOrders(userId: string): Promise<OrderData[]> {
    const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });

    if (error) throw new Error(`注文一覧の取得に失敗しました: ${error.message}`);
    return data || [];
  },

  async getAllOrders(): Promise<OrderData[]> {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

    if (error) throw new Error(`注文一覧の取得に失敗しました: ${error.message}`);
    return data || [];
  },

  async approveOrder(orderId: string, adminUserId: string): Promise<OrderData> {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: 1,
        approved_date: new Date().toISOString(),
        admin_user_id: adminUserId,
      })
      .eq("id", orderId)
      .eq("status", 0)
      .select()
      .single();

    if (error) throw new Error(`注文の承認に失敗しました: ${error.message}`);
    if (!data) throw new Error("承認対象の注文が見つかりません");
    return data;
  },

  async rejectOrder(orderId: string, adminUserId: string, rejectReason?: string): Promise<OrderData> {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: 2,
        rejected_date: new Date().toISOString(),
        admin_user_id: adminUserId,
        reject_reason: rejectReason || null,
      })
      .eq("id", orderId)
      .eq("status", 0)
      .select()
      .single();

    if (error) throw new Error(`注文の拒否に失敗しました: ${error.message}`);
    if (!data) throw new Error("拒否対象の注文が見つかりません");
    return data;
  },
};
