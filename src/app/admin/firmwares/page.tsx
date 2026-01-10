'use client';

import { useState } from 'react';

export default function FirmwaresPage() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.name.endsWith('.bin') || file.name.endsWith('.hex')
    );

    if (droppedFiles.length === 0) {
      setMessage('Допустимы только файлы .bin и .hex');
      return;
    }

    setFiles(prev => [...prev, ...droppedFiles]);
    setMessage('');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setMessage('');

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/api/v1/api/admin/firmwares/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          setMessage(`Ошибка: ${data.detail || 'Не удалось загрузить файл'}`);
          return;
        }
      }

      setMessage(`✓ Успешно загружено ${files.length} файл(ов)`);
      setFiles([]);
    } catch (err: any) {
      setMessage(`Ошибка: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">📁 Загрузка Прошивок</h1>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
          dragActive
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-gray-700 hover:border-orange-500/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-5xl mb-4">📦</div>
        <p className="text-gray-300 mb-2">Перетащите файлы сюда или нажмите кнопку</p>
        <p className="text-gray-500 text-sm mb-4">Поддерживаемые форматы: .bin, .hex</p>

        <label className="inline-block">
          <input
            type="file"
            multiple
            accept=".bin,.hex"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="px-6 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 transition cursor-pointer inline-block">
            Выбрать файлы
          </span>
        </label>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Выбранные файлы ({files.length}):</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-900/50 p-3 rounded border border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📄</span>
                  <div className="text-left">
                    <p className="text-gray-300">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/50 rounded hover:bg-red-500/20 transition text-sm"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {uploading ? '⏳ Загрузка...' : `📤 Загрузить ${files.length} файл(ов)`}
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.includes('✓')
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}
        >
          {message}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-blue-300">
        <p className="text-sm">
          💡 Загруженные прошивки будут доступны в каталоге и поиске. Система автоматически парсирует информацию о марке, модели и ECU.
        </p>
      </div>
    </div>
  );
}
