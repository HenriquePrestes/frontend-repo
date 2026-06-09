//preview de imagem selecionada

import { useState } from "react";

export default function LogoUploader({ onChange, previewUrl }) {
  const [preview, setPreview] = useState(previewUrl);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file, url);
    }
  };

  return (
    <div>
      <p className="font-semibold mb-2">Logo da Clínica</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Pré-visualização:</p>
          <img
            src={preview}
            alt="Prévia da Logo"
            className="h-24 rounded-md border border-gray-300 object-contain bg-white p-2"
          />
        </div>
      )}
    </div>
  );
}
