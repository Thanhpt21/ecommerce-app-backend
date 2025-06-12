// Đảm bảo import UserResponseDto nếu nó ở một file khác
// Ví dụ: import { UserResponseDto } from '../users/dto/user-response.dto';
// Hoặc định nghĩa lại cấu trúc của nó trực tiếp ở đây.
// Để đơn giản, tôi sẽ định nghĩa lại cấu trúc dựa trên UserResponseDto bạn đã cung cấp.

declare namespace Express {
  interface Request {
    user?: {
      id: number;
      name: string;
      email: string;
       phoneNumber: number | null; // Cập nhật
      profilePicture: string | null; // Cập nhật
      gender: string | null; // Cập nhật
      role: string;
      type_account: string;
      isActive: boolean;
    };
  }
}