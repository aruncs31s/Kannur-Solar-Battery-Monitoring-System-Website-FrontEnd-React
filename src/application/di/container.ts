import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { DeviceRepository } from '../../infrastructure/repositories/DeviceRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { LoginUseCase } from '../usecases/auth/LoginUseCase';
import { LogoutUseCase } from '../usecases/auth/LogoutUseCase';
import { GetAllDevicesUseCase } from '../usecases/devices/GetAllDevicesUseCase';
import { CreateDeviceUseCase } from '../usecases/devices/CreateDeviceUseCase';
import { SearchDevicesUseCase } from '../usecases/devices/SearchDevicesUseCase';

class DIContainer {
  private authRepository = new AuthRepository();
  private deviceRepository = new DeviceRepository();
  private userRepository = new UserRepository();

  getLoginUseCase() {
    return new LoginUseCase(this.authRepository);
  }

  getLogoutUseCase() {
    return new LogoutUseCase(this.authRepository);
  }

  getGetAllDevicesUseCase() {
    return new GetAllDevicesUseCase(this.deviceRepository);
  }

  getCreateDeviceUseCase() {
    return new CreateDeviceUseCase(this.deviceRepository);
  }

  getSearchDevicesUseCase() {
    return new SearchDevicesUseCase(this.deviceRepository);
  }

  getAuthRepository() {
    return this.authRepository;
  }

  getDeviceRepository() {
    return this.deviceRepository;
  }

  getUserRepository() {
    return this.userRepository;
  }
}

export const container = new DIContainer();
