import { ConnectedDeviceDTO } from '../../domain/entities/Device';
import { Reading } from '../../domain/entities/Reading';

export interface MCWithSensors extends ConnectedDeviceDTO {
  sensors: ConnectedDeviceDTO[];
  latestReading?: Reading | null;
  expanded: boolean;
}
