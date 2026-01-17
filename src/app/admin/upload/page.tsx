'use client';

import { useState, useCallback } from 'react';
import { uploadFirmware } from '@/lib/admin-api';

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export default function AdminUploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadFile[] = droppedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files);
    const newFiles: UploadFile[] = selectedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadAllFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;
      
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: 'uploading', progress: 0 } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append('file', files[i].file);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f
            )
          );
        }, 100);

        await uploadFirmware(formData);
        clearInterval(progressInterval);

        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'done', progress: 100 } : f
          )
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Ошибка' }
              : f
          )
        );
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== 'done'));
  };

  return (
    <div className="space-y-6 pt-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Загрузка прошивок</h1>
        <p className="text-gray-400">Drag & Drop или выберите файлы</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
          isDragging
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <div className="text-6xl mb-4">📁</div>
        <p className="text-xl text-gray-300 mb-2">
          Перетащите файлы сюда
        </p>
        <p className="text-gray-500 mb-4">или</p>
        <label className="cursor-pointer">
          <span className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition">
            Выбрать файлы
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".bin,.hex"
          />
        </label>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              Файлы ({files.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={clearCompleted}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
              >
                Очистить загруженные
              </button>
              <button
                onClick={uploadAllFiles}
                disabled={!files.some((f) => f.status === 'pending')}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                Загрузить все
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-gray-700/30 rounded-lg p-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-white truncate">{f.file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(f.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {/* Progress */}
                {f.status === 'uploading' && (
                  <div className="w-32">
                    <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="w-20 text-center">
                  {f.status === 'pending' && (
                    <span className="text-gray-400">Ожидает</span>
                  )}
                  {f.status === 'uploading' && (
                    <span className="text-orange-400">{f.progress}%</span>
                  )}
                  {f.status === 'done' && (
                    <span className="text-green-400">✓ Готово</span>
                  )}
                  {f.status === 'error' && (
                    <span className="text-red-400" title={f.error}>
                      ✕ Ошибка
                    </span>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFile(i)}
                  className="text-gray-500 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
