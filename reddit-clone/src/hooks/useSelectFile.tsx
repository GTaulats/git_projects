import React, { useState } from 'react';

const useSelectFile = () => {

  const [selectedFile, setSelectedFile] = useState<string>();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader(); // From JS

    if (event.target.files?.[0]) { // Technically it could include several files at once
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    }
  };

  return {
    selectedFile, setSelectedFile, onSelectFile
  }
}
export default useSelectFile;
