import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { dataSourceOptions } from 'db/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
