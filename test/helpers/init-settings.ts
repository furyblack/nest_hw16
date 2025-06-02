import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSetup } from '../../src/setup/app.setup';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { UsersTestManager } from './users-test-manager';
import { deleteAllData } from './delete-all-data';
import { BlogsTestManager } from './blogs-test-manager';
import { PostsTestManager } from './posts-test-manager';
import { AuthTestManager } from './auth-test-manager';
import { EmailService } from '../../src/moduls/notifications/email.service';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();

  appSetup(app);

  const emailService = app.get<EmailService>(EmailService);

  await app.init();
  const databaseConnection = app.get<Connection>(getConnectionToken());
  const httpServer = app.getHttpServer();
  const userTestManger = new UsersTestManager(app);
  const blogTestManager = new BlogsTestManager(app);
  const postTestManager = new PostsTestManager(app, blogTestManager);
  const authTestManager = new AuthTestManager(app, emailService);

  await deleteAllData(app);

  return {
    app,
    databaseConnection,
    httpServer,
    userTestManger,
    blogTestManager,
    postTestManager,
    authTestManager,
  };
};
