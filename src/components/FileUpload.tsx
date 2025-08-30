import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);
    
    if (rejectedFiles.length > 0) {
      setUploadError('Please upload only PDF or DOCX files');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError('File size must be less than 10MB');
        return;
      }
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isLoading
  });

  const removeFile = () => {
    acceptedFiles.Length = 0;
    setUploadError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {acceptedFiles.length === 0 ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag & drop your resume file here, or click to select
            </p>
            <p className="text-xs text-gray-500">
              Supports PDF and DOCX files up to 10MB
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {acceptedFiles[0].name}
                </p>
                <p className="text-xs text-gray-500">
                  {(acceptedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
        )}
        
        {isLoading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Analyzing your resume...</p>
          </div>
        )}
      </div>
      
      {uploadError && (
        <div className="mt-4 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}
    </div>
  );
};