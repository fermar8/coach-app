import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { MessageEntity } from '../../domain/common/entities';

@Injectable()
export class CommonService {
  private readonly loggerService: LoggerService;

  constructor() {
    this.loggerService = new Logger(CommonService.name);
  }

  public generateMessage(message: string): MessageEntity {
    return new MessageEntity(message);
  }

  public excludeFieldFromObject<T extends Record<string, any>>(
    object: T,
    keys: string[],
  ): Omit<T, keyof typeof keys> {
    const clonedObj = { ...object };
    for (const key of keys) {
      delete clonedObj[key];
    }
    return clonedObj;
  }
}
