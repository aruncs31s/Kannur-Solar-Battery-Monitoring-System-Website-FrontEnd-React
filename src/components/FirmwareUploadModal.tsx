import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { Modal } from './Modal';

interface FirmwareUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: number;
  deviceName: string;
  onUploadSuccess: () => void;
}

export const FirmwareUploadModal = ({
  isOpen,
  onClose,
  deviceId,
  deviceName,
  onUploadSuccess
}: FirmwareUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.bin')) {
        setMessage('Please select a valid firmware file (.bin)');
        setIsSuccess(false);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setMessage('File size must be less than 10MB');
        setIsSuccess(false);
        return;
      }

      setSelectedFile(file);
      setMessage('');
      setIsSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a firmware file first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage('');
    setIsSuccess(false);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await devicesAPI.uploadFirmware(deviceId, selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setMessage('Firmware uploaded successfully!');
      setIsSuccess(true);

      setTimeout(() => {
        onUploadSuccess();
        handleClose();
      }, 2000);

    } catch (error: any) {
      let errorMessage = 'Upload failed';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) errorMessage = data?.message || data?.error || 'Bad Request';
        else if (status === 413) errorMessage = 'File too large (max 10MB)';
        else if (status === 415) errorMessage = 'Unsupported file type (.bin only)';
        else if (status === 500) errorMessage = 'Server error';
        else errorMessage = data?.message || data?.error || `Error ${status}`;
      } else {
        errorMessage = error.message || 'Upload failed';
      }
      
      setMessage(errorMessage);
      setIsSuccess(false);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setMessage('');
    setIsSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Upload Firmware - ${deviceName}`}
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 group">
            <label className="text-sm font-bold text-text-secondary group-focus-within:text-primary-500 transition-colors">
              Select Firmware File (.bin)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                selectedFile 
                  ? 'border-success/50 bg-success/5' 
                  : 'border-border-primary hover:border-primary-500 bg-surface-secondary'
              }`}
            >
              <Upload className={selectedFile ? 'text-success' : 'text-text-tertiary'} size={32} />
              <div className="text-center">
                <p className="text-sm font-semibold text-text-primary">
                  {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Binary files only, max 10MB'}
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".bin"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </div>

          {uploading && (
            <div className="space-y-2 animate-in fade-in duration-300">
              <div className="flex justify-between text-sm font-medium text-text-secondary">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-surface-tertiary rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(94,129,172,0.4)]"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {message && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
              isSuccess
                ? 'bg-success-bg text-success border-success-border'
                : 'bg-error-bg text-error border-error-border'
            }`}>
              {isSuccess ? <CheckCircle className="mt-0.5" size={18} /> : <AlertCircle className="mt-0.5" size={18} />}
              <span className="text-sm font-semibold">{message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-primary">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-6 py-2.5 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors bg-surface-secondary hover:bg-surface-tertiary rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};