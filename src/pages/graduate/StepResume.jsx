import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StepResume = ({ onNext, onSkip, setExtractedSkills }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        // check why it was rejected
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File is too large. Maximum size is 5MB.');
        } else {
          setError('Only PDF and DOCX files are accepted.');
        }
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      setError('');
      setUploading(true);

      const formData = new FormData();
      formData.append('resume', file);

      try {
        const { data } = await api.post('/onboarding/resume', formData);

        setUploadedFile({ name: file.name, size: file.size });
        setExtractedSkills(data.extractedSkills || []);

        const count = data.extractedSkills?.length || 0;
        toast.success(
          count > 0
            ? `Resume uploaded: ${count} skills detected`
            : 'Resume uploaded: add your skills manually in the next step'
        );
      } catch (err) {
        setError(
          err.response?.data?.message || 'Upload failed. Please try again.'
        );
      } finally {
        setUploading(false);
      }
    },
    [setExtractedSkills]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: uploading,
  });

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedSkills([]);
    setError('');
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-xl font-bold text-text-heading'>
          Upload your resume
        </h2>
        <p className='text-sm text-text-muted mt-1'>
          We will automatically extract your skills from it. Only PDF and DOCX
          are accepted.
        </p>
      </div>

      {/* Dropzone */}
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer
            ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-surface'
            }
            ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />

          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10'>
            <UploadCloud size={26} className='text-primary' />
          </div>

          {isDragActive ? (
            <p className='text-sm font-medium text-primary'>
              Drop your resume here
            </p>
          ) : uploading ? (
            <div className='flex flex-col items-center gap-2'>
              <div className='w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin' />
              <p className='text-sm text-text-muted'>Processing resume...</p>
            </div>
          ) : (
            <>
              <div>
                <p className='text-sm font-medium text-text-heading'>
                  Drag and drop your resume here
                </p>
                <p className='text-xs text-text-muted mt-1'>
                  or click to browse your files
                </p>
              </div>
              <div className='flex items-center gap-3'>
                <span className='rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-text-muted'>
                  PDF
                </span>
                <span className='rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-text-muted'>
                  DOCX
                </span>
                <span className='text-xs text-text-muted'>· Max 5MB</span>
              </div>
            </>
          )}
        </div>
      ) : (
        // Uploaded file card
        <div className='flex items-center gap-4 rounded-2xl border border-border bg-surface p-5'>
          <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10'>
            <FileText size={22} className='text-success' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-text-heading truncate'>
              {uploadedFile.name}
            </p>
            <div className='flex items-center gap-2 mt-0.5'>
              <CheckCircle2 size={13} className='text-success' />
              <p className='text-xs text-success font-medium'>
                Uploaded: {formatSize(uploadedFile.size)}
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className='shrink-0 rounded-lg p-1.5 text-text-muted hover:bg-border hover:text-text-heading transition-colors'
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className='text-sm text-danger flex items-center gap-2'>
          <X size={14} className='shrink-0' />
          {error}
        </p>
      )}

      {/* Actions */}
      <div className='flex items-center justify-between pt-2'>
        <button
          onClick={onSkip}
          className='text-sm font-medium text-text-muted hover:text-text-heading transition-colors'
        >
          Skip for now
        </button>

        <button
          onClick={onNext}
          disabled={!uploadedFile && !error}
          className='flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors'
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Skip hint */}
      {!uploadedFile && (
        <p className='text-xs text-text-muted text-center -mt-2'>
          You can still add skills manually in the next step
        </p>
      )}
    </div>
  );
};

export default StepResume;
