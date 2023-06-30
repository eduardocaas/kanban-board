import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { typeOrmConfig } from './configs/typeorm.config';
import { ProjectModule } from './entities/project/project.module';
import { TaskModule } from './entities/task/task.module';
import { UserModule } from './entities/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProjectModule, TaskModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
