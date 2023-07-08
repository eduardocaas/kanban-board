import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { typeOrmConfig } from './configs/typeorm.config';
import { ProjectModule } from './entities/project/project.module';
import { TaskModule } from './entities/task/task.module';
import { UserModule } from './entities/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    ProjectModule, TaskModule, UserModule,
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
