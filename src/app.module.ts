import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DetailsModule } from './modules/details/details.module';
import { CartModule } from './modules/cart/cart.module';
import { ProductsModule } from './modules/products/products.module';

import * as path from 'path'; // Import module path


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST'),
        port: configService.get('PG_PORT'),
        username: configService.get('PG_USER'),
        password: configService.get('PG_PASSWORD'),
        database: configService.get('PG_DB'),

        entities:  [path.join(__dirname, '**', '*.entity{.ts,.js}')],


        synchronize: true,
      }),
      inject: [ConfigService],
     
    }),

    DetailsModule,
    CartModule,
    ProductsModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}