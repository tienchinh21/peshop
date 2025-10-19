export const createFormDataWithJson = (
  data: any,
  files?: File | File[]
): FormData => {
  const formData = new FormData();

  // Create a Blob with application/json type for Spring Boot @RequestPart
  const dataBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });

  // Append as "data" part with filename to help Spring Boot parse it correctly
  formData.append("data", dataBlob, "data.json");

  if (files) {
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("logofile", file);
      });
    } else {
      formData.append("logofile", files);
    }
  } else {
    // Add empty string if no file provided
    formData.append("logofile", "string");
  }

  return formData;
};
