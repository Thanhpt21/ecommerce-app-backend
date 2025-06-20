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
export interface GHTKCreateOrderResponse {
  success: boolean; // Cho biết việc tạo đơn hàng có thành công hay không.
  message?: string; // Tin nhắn tùy chọn, thường dùng cho phản hồi thành công.
  order?: { // Đối tượng tùy chọn chứa thông tin chi tiết của đơn hàng đã tạo.
    partner_id: string; // Mã ID duy nhất của đơn hàng từ hệ thống của bạn.
    label: string; // Mã vận đơn hoặc mã theo dõi của GHTK cho đơn hàng.
    area: string; // Khu vực địa lý hoặc vùng dịch vụ của đơn hàng.
    fee: number; // Phí vận chuyển đã tính cho đơn hàng cụ thể này.
    insurance_fee: number; // Phí bảo hiểm áp dụng cho đơn hàng này.
    created: string; // Thời gian (timestamp) cho biết khi nào đơn hàng được tạo.
  };
  reason?: string; // Tin nhắn tùy chọn cung cấp lý do thất bại, nếu 'success' là false.
}

export interface GHTKProvinceResponse {
  success: boolean; // Cho biết yêu cầu lấy danh sách tỉnh/thành phố có thành công hay không.
  data: { // Một mảng các đối tượng, mỗi đối tượng đại diện cho một tỉnh/thành phố.
    ProvinceID: number; // ID số duy nhất của tỉnh/thành phố.
    ProvinceName: string; // Tên của tỉnh/thành phố.
  }[];
}
export interface GHTKDistrictResponse {
  success: boolean; // Cho biết yêu cầu lấy danh sách quận/huyện có thành công hay không.
  data: { // Một mảng các đối tượng, mỗi đối tượng đại diện cho một quận/huyện.
    DistrictID: number; // ID số duy nhất của quận/huyện.
    DistrictName: string; // Tên của quận/huyện.
    ProvinceID: number; // ID của tỉnh/thành phố mà quận/huyện này thuộc về.
  }[];
}

export interface GHTKWardResponse {
  success: boolean; // Cho biết yêu cầu lấy danh sách phường/xã có thành công hay không.
  data: { // Một mảng các đối tượng, mỗi đối tượng đại diện cho một phường/xã.
    WardID: number; // ID số duy nhất của phường/xã.
    WardName: string; // Tên của phường/xã.
    DistrictID: number; // ID của quận/huyện mà phường/xã này thuộc về.
  }[];
}