import { Link } from 'react-router-dom';
import { Activity, MapPin, Clock } from 'lucide-react';

export const QuickActions = () => {
  return (
    <div className="bg-surface-primary rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/map"
          className="bg-info-50 hover:bg-info-100 border border-info-200 rounded-lg p-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className="text-info-500" size={24} />
            <div>
              <h4 className="font-semibold text-info-900">View on Map</h4>
              <p className="text-sm text-info-700">See all device locations</p>
            </div>
          </div>
        </Link>

        <Link
          to="/readings"
          className="bg-success-50 hover:bg-success-100 border border-success-200 rounded-lg p-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Activity className="text-success-500" size={24} />
            <div>
              <h4 className="font-semibold text-success-900">All Readings</h4>
              <p className="text-sm text-success-700">View system performance</p>
            </div>
          </div>
        </Link>

        <Link
          to="/audit"
          className="bg-warning-50 hover:bg-warning-100 border border-warning-200 rounded-lg p-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Clock className="text-warning-500" size={24} />
            <div>
              <h4 className="font-semibold text-warning-900">Activity Log</h4>
              <p className="text-sm text-warning-700">Monitor system activity</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};