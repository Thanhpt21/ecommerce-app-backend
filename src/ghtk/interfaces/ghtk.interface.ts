import { GHTKDeliverOption, GHTKPickOption, GHTKTransportOption } from "../dto/calculate-fee.dto";

export interface DefaultPickupConfig {
  pick_name: string;
  pick_address: string;
  pick_province: string;
  pick_district: string;
  pick_ward?: string;
  pick_tel: string;
}

export interface GHTKProduct {
  name: string;
  weight: number; // kg
  quantity: number;
  price: number;
  product_code?: string | number; // Updated to accept string or number as per your reference
}

export interface GHTKOrderRequestData {
  id: string;
  pick_name: string;
  pick_address: string;
  pick_province: string;
  pick_district: string;
  pick_ward?: string;
  pick_tel: string;
  pick_money: number; // Tiền thu hộ
  name: string; // Tên người nhận
  address: string; // Địa chỉ người nhận
  province: string;
  district: string;
  ward?: string;
  hamlet: string;
  tel: string;
  email?: string; // Email người nhận
  note?: string;
  value: number; // Giá trị đóng khai giá
  is_freeship: '0' | '1'; // ⭐ Changed to string '0' or '1' as per your reference ⭐
  pick_option: GHTKPickOption;
  transport: GHTKTransportOption;
  deliver_option: GHTKDeliverOption;
  pick_date?: string; // Added this field as it's in your reference
  // Additional fields from your reference:
  // "Khối lượng tính cước tối đa: 1.00 kg" is typically a note, not a separate field.
  // "GHTK - HCM - Noi Thanh" seems to be part of 'name' in your reference, which is fine.
}

export interface GHTKCreateOrderPayload {
  order: GHTKOrderRequestData;
  products: GHTKProduct[];
}

export interface GHTKCreateOrderResponse {
  success: boolean;
  message?: string;
  order?: {
    label: string;
    partner_id: string;
    area: string;
    fee: number;
    insurance: number;
    estimated_pick_time: string;
    estimated_deliver_time: string;
    status: string;
    tracking_link: string;
    // ... other fields from GHTK response
  };
}


export interface GHTKCancelOrderResponse {
  success: boolean; // Cho biết yêu cầu hủy đơn hàng có thành công hay không.
  message?: string; // Tin nhắn phản hồi (ví dụ: "Hủy đơn hàng thành công").
  reason?: string; // Lý do thất bại nếu success là false.
}

export interface GHTKShipFeeResponse {
  success: boolean; // Cho biết yêu cầu có thành công hay không (true là thành công, false là thất bại).
  message?: string; // Tin nhắn tùy chọn cung cấp thông tin chi tiết hơn, thường dùng cho các thông báo thành công.
  fee?: { // Đối tượng tùy chọn chứa thông tin chi tiết về phí nếu yêu cầu thành công.
    name: string; // Tên của dịch vụ vận chuyển hoặc loại phí.
    fee: number; // Số tiền phí vận chuyển chính.
    insurance_fee: number; // Phí bảo hiểm, nếu có.
    extra_fee: { // Đối tượng chi tiết các khoản phí bổ sung.
      pickup_fee: number; // Phí lấy hàng (pickup).
      return_fee: number; // Phí hoàn hàng (return), nếu việc giao hàng không thành công.
    };
  };
  reason?: string; // Tin nhắn tùy chọn cung cấp lý do thất bại, nếu 'success' là false.
}



export interface GHTKTrackingResponse {
  success: boolean; // Cho biết yêu cầu có thành công hay không.
  message?: string; // Tin nhắn tùy chọn.
  order?: { // Đối tượng chứa thông tin chi tiết về trạng thái đơn hàng.
    label: string; // Mã vận đơn của GHTK.
    partner_id: string; // Mã ID đơn hàng từ hệ thống của bạn.
    status: number; // Mã trạng thái của đơn hàng (ví dụ: 1: Đang lấy hàng, 2: Đang giao hàng, -1: Đã hủy).
    status_text: string; // Mô tả trạng thái bằng văn bản.
    // Các trường khác có thể có tùy thuộc vào GHTK, ví dụ:
    // tracking_id: string;
    // created_at: string;
    // deliver_date: string;
    // receiver_name: string;
    // receiver_address: string;
    // events: { event_time: string; status: string; address: string; }[]; // Lịch sử các sự kiện
  };
  reason?: string; // Lý do thất bại nếu success là false.
}


// Giả định các kiểu dữ liệu phản hồi từ GHTK
export interface GHTKBaseResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface GHTKProvince {
  ProvinceID: number;
  ProvinceName: string;
}

export interface GHTKDistrict {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
}

export interface GHTKWard {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}

export interface GHTKProvinceResponse extends GHTKBaseResponse<GHTKProvince[]> {}
export interface GHTKDistrictResponse extends GHTKBaseResponse<GHTKDistrict[]> {}
export interface GHTKWardResponse extends GHTKBaseResponse<GHTKWard[]> {}

