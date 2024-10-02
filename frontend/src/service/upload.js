export const upload = async (file, service="default") => {
  const path = `${service}/${file.name}`;

  const { signedUrl } = await fetch(process.env.REACT_APP_API_HOST + "/uploads/get-signed-url", {
    method: "POST",
    body: JSON.stringify({ path }),
  }).then((res) => res.json());

  // upload
  await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  console.log("upload complete!");
  return path;
};