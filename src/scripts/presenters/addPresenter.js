export async function postStory(token, formData) {
  const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: formData,
  });
  const data = await response.json();
  if (data.error) throw new Error(data.message);
  return data;
}