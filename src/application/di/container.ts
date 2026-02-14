import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { DeviceRepository } from '../../infrastructure/repositories/DeviceRepository';
import { DeviceTypesRepository } from '../../infrastructure/repositories/DeviceTypesRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { ReadingRepository } from '../../infrastructure/repositories/ReadingRepository';
import { AuditRepository } from '../../infrastructure/repositories/AuditRepository';
import { VersionRepository } from '../../infrastructure/repositories/VersionRepository';
import { LocationRepository } from '../../infrastructure/repositories/LocationRepository';
import { LoginUseCase } from '../usecases/auth/LoginUseCase';
import { LogoutUseCase } from '../usecases/auth/LogoutUseCase';
import { GetAllDevicesUseCase } from '../usecases/devices/GetAllDevicesUseCase';
import { GetMyDevicesUseCase } from '../usecases/devices/GetMyDevicesUseCase';
import { GetRecentDevicesUseCase } from '../usecases/devices/GetRecentDevicesUseCase';
import { GetProgressiveReadingsUseCase } from '../usecases/devices/GetProgressiveReadingsUseCase';
import { GetOfflineDevicesUseCase } from '../usecases/devices/GetOfflineDevicesUseCase';
import { GetDeviceTypesUseCase } from '../usecases/devices/GetDeviceTypesUseCase';
import { GetHardwareDeviceTypesUseCase } from '../usecases/devices/GetHardwareDeviceTypesUseCase';
import { CreateDeviceUseCase } from '../usecases/devices/CreateDeviceUseCase';
import { CreateSolarDeviceUseCase } from '../usecases/devices/CreateSolarDeviceUseCase';
import { CreateSensorDeviceUseCase } from '../usecases/devices/CreateSensorDeviceUseCase';
import { CreateDeviceTypeUseCase } from '../usecases/devices/CreateDeviceTypeUseCase';
import { GetMySolarDevicesUseCase } from '../usecases/devices/GetMySolarDevicesUseCase';
import { GetDeviceUseCase } from '../usecases/devices/GetDeviceUseCase';
import { UploadFirmwareUseCase } from '../usecases/devices/UploadFirmwareUseCase';
import { BuildFirmwareUseCase } from '../usecases/devices/BuildFirmwareUseCase';
import { GetFirmwareBuildStatusUseCase } from '../usecases/devices/GetFirmwareBuildStatusUseCase';
import { DownloadFirmwareUseCase } from '../usecases/devices/DownloadFirmwareUseCase';
import { GetDeviceStateHistoryUseCase } from '../usecases/devices/GetDeviceStateHistoryUseCase';
import { SearchDevicesUseCase } from '../usecases/devices/SearchDevicesUseCase';
import { SearchMicrocontrollersUseCase } from '../usecases/devices/SearchMicrocontrollersUseCase';
import { GetMicrocontrollersUseCase } from '../usecases/devices/GetMicrocontrollersUseCase';
import { GetMicrocontrollerStatsUseCase } from '../usecases/devices/GetMicrocontrollerStatsUseCase';
import { GenerateDeviceTokenUseCase } from '../usecases/devices/GenerateDeviceTokenUseCase';
import { GetDeviceTypeUseCase } from '../usecases/devices/GetDeviceTypeUseCase';
import { UpdateDeviceUseCase } from '../usecases/devices/UpdateDeviceUseCase';
import { RemoveConnectedDeviceUseCase } from '../usecases/devices/RemoveConnectedDeviceUseCase';
import { ControlDeviceUseCase } from '../usecases/devices/ControlDeviceUseCase';
import { CreateDeviceStateUseCase } from '../usecases/devices/CreateDeviceStateUseCase';
import { GetDeviceStateUseCase } from '../usecases/devices/GetDeviceStateUseCase';
import { GetDeviceStatesUseCase } from '../usecases/devices/GetDeviceStatesUseCase';
import { UpdateDeviceStateUseCase } from '../usecases/devices/UpdateDeviceStateUseCase';
import { GetDeviceReadingsUseCase, GetReadingsByDateRangeUseCase, GetSevenDaysReadingsByLocationUseCase } from '../usecases/readings/GetReadingsUseCase';
import { GetAuditLogsUseCase } from '../usecases/audit/GetAuditLogsUseCase';
import { GetUsersUseCase } from '../usecases/users/GetUsersUseCase';
// import { CreateUserUseCase } from '../usecases/users/CreateUserUseCase';
import { DeleteUserUseCase } from '../usecases/users/DeleteUserUseCase';
import { GetAllLocationsUseCase } from '../usecases/locations/GetAllLocationsUseCase';
import { GetLocationUseCase } from '../usecases/locations/GetLocationUseCase';
import { SearchLocationsUseCase } from '../usecases/locations/SearchLocationsUseCase';
import { CreateLocationUseCase } from '../usecases/locations/CreateLocationUseCase';
import { UpdateLocationUseCase } from '../usecases/locations/UpdateLocationUseCase';
import { DeleteLocationUseCase } from '../usecases/locations/DeleteLocationUseCase';
import { GetDevicesByLocationUseCase } from '../usecases/locations/GetDevicesByLocationUseCase';

class DIContainer {
  private authRepository = new AuthRepository();
  private deviceRepository = new DeviceRepository();
  private deviceTypesRepository = new DeviceTypesRepository();
  private userRepository = new UserRepository();
  private readingRepository = new ReadingRepository();
  private auditRepository = new AuditRepository();
  private versionRepository = new VersionRepository();
  private locationRepository = new LocationRepository();

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

  getGetRecentDevicesUseCase() {
    return new GetRecentDevicesUseCase(this.deviceRepository);
  }

  getGetProgressiveReadingsUseCase() {
    return new GetProgressiveReadingsUseCase(this.deviceRepository);
  }

  getGetOfflineDevicesUseCase() {
    return new GetOfflineDevicesUseCase(this.deviceRepository);
  }

  getCreateDeviceUseCase() {
    return new CreateDeviceUseCase(this.deviceRepository);
  }

  getCreateSolarDeviceUseCase() {
    return new CreateSolarDeviceUseCase(this.deviceRepository);
  }

  getCreateSensorDeviceUseCase() {
    return new CreateSensorDeviceUseCase(this.deviceRepository);
  }

  getCreateDeviceTypeUseCase() {
    return new CreateDeviceTypeUseCase(this.deviceRepository);
  }

  getGetMySolarDevicesUseCase() {
    return new GetMySolarDevicesUseCase(this.deviceRepository);
  }

  getGetDeviceUseCase() {
    return new GetDeviceUseCase(this.deviceRepository);
  }

  getUploadFirmwareUseCase() {
    return new UploadFirmwareUseCase(this.deviceRepository);
  }

  getBuildFirmwareUseCase() {
    return new BuildFirmwareUseCase(this.deviceRepository);
  }

  getGetFirmwareBuildStatusUseCase() {
    return new GetFirmwareBuildStatusUseCase(this.deviceRepository);
  }

  getDownloadFirmwareUseCase() {
    return new DownloadFirmwareUseCase(this.deviceRepository);
  }

  getGetDeviceStateHistoryUseCase() {
    return new GetDeviceStateHistoryUseCase(this.deviceRepository);
  }

  getGetDeviceStatesUseCase() {
    return new GetDeviceStatesUseCase(this.deviceRepository);
  }

  getGetDeviceStateUseCase() {
    return new GetDeviceStateUseCase(this.deviceRepository);
  }

  getCreateDeviceStateUseCase() {
    return new CreateDeviceStateUseCase(this.deviceRepository);
  }

  getUpdateDeviceStateUseCase() {
    return new UpdateDeviceStateUseCase(this.deviceRepository);
  }

  getSearchDevicesUseCase() {
    return new SearchDevicesUseCase(this.deviceRepository);
  }

  getSearchMicrocontrollersUseCase() {
    return new SearchMicrocontrollersUseCase(this.deviceRepository);
  }

  getGetMicrocontrollersUseCase() {
    return new GetMicrocontrollersUseCase(this.deviceRepository);
  }

  getGetMicrocontrollerStatsUseCase() {
    return new GetMicrocontrollerStatsUseCase(this.deviceRepository);
  }

  getGenerateDeviceTokenUseCase() {
    return new GenerateDeviceTokenUseCase(this.deviceRepository);
  }

  getRemoveConnectedDeviceUseCase() {
    return new RemoveConnectedDeviceUseCase(this.deviceRepository);
  }

  getGetDeviceTypesUseCase() {
    return new GetDeviceTypesUseCase(this.deviceTypesRepository);
  }

  getGetDeviceTypeUseCase() {
    return new GetDeviceTypeUseCase(this.deviceRepository);
  }

  getUpdateDeviceUseCase() {
    return new UpdateDeviceUseCase(this.deviceRepository);
  }

  getControlDeviceUseCase() {
    return new ControlDeviceUseCase(this.deviceRepository);
  }

  getGetHardwareDeviceTypesUseCase() {
    return new GetHardwareDeviceTypesUseCase(this.deviceTypesRepository);
  }

  getGetDeviceReadingsUseCase() {
    return new GetDeviceReadingsUseCase(this.readingRepository);
  }

  getGetReadingsByDateRangeUseCase() {
    return new GetReadingsByDateRangeUseCase(this.readingRepository);
  }

  getGetSevenDaysReadingsByLocationUseCase() {
    return new GetSevenDaysReadingsByLocationUseCase(this.readingRepository);
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

  getLocationRepository() {
    return this.locationRepository;
  }

  getGetAllLocationsUseCase() {
    return new GetAllLocationsUseCase(this.locationRepository);
  }

  getGetLocationUseCase() {
    return new GetLocationUseCase(this.locationRepository);
  }

  getSearchLocationsUseCase() {
    return new SearchLocationsUseCase(this.locationRepository);
  }

  getCreateLocationUseCase() {
    return new CreateLocationUseCase(this.locationRepository);
  }

  getUpdateLocationUseCase() {
    return new UpdateLocationUseCase(this.locationRepository);
  }

  getDeleteLocationUseCase() {
    return new DeleteLocationUseCase(this.locationRepository);
  }

  getGetDevicesByLocationUseCase() {
    return new GetDevicesByLocationUseCase(this.locationRepository);
  }
}

export const container = new DIContainer();
