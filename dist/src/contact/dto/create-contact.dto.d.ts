import { ContactType } from '../enums/contact.enums';
export declare class CreateContactDto {
    name: string;
    email: string;
    mobile?: string;
    comment: string;
    status?: string;
    type?: ContactType;
}
