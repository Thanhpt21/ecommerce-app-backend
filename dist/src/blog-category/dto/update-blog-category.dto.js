"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_blog_category_dto_1 = require("./create-blog-category.dto");
class UpdateBlogCategoryDto extends (0, mapped_types_1.PartialType)(create_blog_category_dto_1.CreateBlogCategoryDto) {
}
exports.UpdateBlogCategoryDto = UpdateBlogCategoryDto;
//# sourceMappingURL=update-blog-category.dto.js.map