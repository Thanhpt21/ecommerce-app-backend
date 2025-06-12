import { Module } from '@nestjs/common';
import { ShippingAddressController } from './shipping-address.controller';
import { ShippingAddressService } from './shipping-address.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShippingAddressController],
  providers: [ShippingAddressService]
})
export class ShippingAddressModule {}
