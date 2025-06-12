"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = void 0;
class UserResponseDto {
    id;
    name;
    email;
    phoneNumber;
    profilePicture;
    gender;
    role;
    type_account;
    isActive;
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.type_account = user.type_account;
        this.phoneNumber = user.phoneNumber || null;
        this.profilePicture = user.profilePicture || null;
        this.gender = user.gender || null;
        this.isActive = user.isActive;
    }
}
exports.UserResponseDto = UserResponseDto;
//# sourceMappingURL=user-response.dto.js.map