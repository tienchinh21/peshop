export const createFormDataWithJson = (data: any, files?: File | File[]): FormData => {
  const formData = new FormData();
  const dataBlob = new Blob([JSON.stringify(data)], {
    type: "application/json"
  });
  formData.append("data", dataBlob, "data.json");
  if (files) {
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append("logofile", file);
      });
    } else {
      formData.append("logofile", files);
    }
  } else {
    formData.append("logofile", "string");
  }
  return formData;
};