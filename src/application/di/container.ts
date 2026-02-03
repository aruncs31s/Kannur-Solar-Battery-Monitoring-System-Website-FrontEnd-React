import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { DeviceRepository } from '../../infrastructure/repositories/DeviceRepository';
import { DeviceTypesRepository } from '../../infrastructure/repositories/DeviceTypesRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { ReadingRepository } from '../../infrastructure/repositories/ReadingRepository';
import { AuditRepository } from '../../infrastructure/repositories/AuditRepository';
import { VersionRepository } from '../../infrastructure/repositories/VersionRepository';
import { LoginUseCase } from '../usecases/auth/LoginUseCase';
import { LogoutUseCase } from '../usecases/auth/LogoutUseCase';
import { GetAllDevicesUseCase } from '../usecases/devices/GetAllDevicesUseCase';
import { GetMyDevicesUseCase } from '../usecases/devices/GetMyDevicesUseCase';
import { GetDeviceTypesUseCase } from '../usecases/devices/GetDeviceTypesUseCase';
import { CreateDeviceUseCase } from '../usecases/devices/CreateDeviceUseCase';
import { SearchDevicesUseCase } from '../usecases/devices/SearchDevicesUseCase';
import { GenerateDeviceTokenUseCase } from '../usecases/devices/GenerateDeviceTokenUseCase';
import { GetDeviceReadingsUseCase, GetReadingsByDateRangeUseCase } from '../usecases/readings/GetReadingsUseCase';
import { GetAuditLogsUseCase } from '../usecases/audit/GetAuditLogsUseCase';
import { GetUsersUseCase } from '../usecases/users/GetUsersUseCase';
// import { CreateUserUseCase } from '../usecases/users/CreateUserUseCase';
import { DeleteUserUseCase } from '../usecases/users/DeleteUserUseCase';

class DIContainer {
  private authRepository = new AuthRepository();
  private deviceRepository = new DeviceRepository();
  private deviceTypesRepository = new DeviceTypesRepository();
  private userRepository = new UserRepository();
  private readingRepository = new ReadingRepository();
  private auditRepository = new AuditRepository();
  private versionRepository = new VersionRepository();

  getLoginUseCase() {
    return new LoginUseCase(this.authRepository);
  }

  getLogoutUseCase() {
    return new LogoutUseCase(this.authRepository);
  }

  getGetAllDevicesUseCase() {
    return new GetAllDevicesUseCase(this.deviceRepository);
  }

  getGetMyDevicesUseCase() {
    return new GetMyDevicesUseCase(this.deviceRepository);
  }

  getCreateDeviceUseCase() {
    return new CreateDeviceUseCase(this.deviceRepository);
  }

  getSearchDevicesUseCase() {
    return new SearchDevicesUseCase(this.deviceRepository);
  }

  getGenerateDeviceTokenUseCase() {
    return new GenerateDeviceTokenUseCase(this.deviceRepository);
  }

  getGetDeviceTypesUseCase() {
    return new GetDeviceTypesUseCase(this.deviceTypesRepository);
  }

  getGetDeviceReadingsUseCase() {
    return new GetDeviceReadingsUseCase(this.readingRepository);
  }

  getGetReadingsByDateRangeUseCase() {
    return new GetReadingsByDateRangeUseCase(this.readingRepository);
  }

  getGetAuditLogsUseCase() {
    return new GetAuditLogsUseCase(this.auditRepository);
  }

  getGetUsersUseCase() {
    return new GetUsersUseCase(this.userRepository);
  }

  // getCreateUserUseCase() {
  //   return new CreateUserUseCase(this.userRepository);
  // }

  getDeleteUserUseCase() {
    return new DeleteUserUseCase(this.userRepository);
  }

  getAuthRepository() {
    return this.authRepository;
  }

  getDeviceRepository() {
    return this.deviceRepository;
  }

  getDeviceTypesRepository() {
    return this.deviceTypesRepository;
  }

  getUserRepository() {
    return this.userRepository;
  }

  getReadingRepository() {
    return this.readingRepository;
  }

  getAuditRepository() {
    return this.auditRepository;
  }

  getVersionRepository() {
    return this.versionRepository;
  }
}

export const container = new DIContainer();
