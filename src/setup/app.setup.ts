import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { globalPrefixSetup } from './global-prefix.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import { validationConstraintSetup } from './validation-constraint.setup';
import cookieParser from 'cookie-parser';

export function appSetup(app: INestApplication) {
  app.use(cookieParser());
  pipesSetup(app);
  globalPrefixSetup(app);
  exceptionFilterSetup(app);
  validationConstraintSetup(app);
}
