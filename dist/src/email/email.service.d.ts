import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendResetPasswordEmail(to: string, resetLink: string): Promise<void>;
}
