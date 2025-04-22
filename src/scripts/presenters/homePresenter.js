export async function fetchStories(token) {
  const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1', {
    headers: { Authorization: 'Bearer ' + token }
  });
  const data = await response.json();
  if (data.error) throw new Error(data.message);
  return data.listStory || [];
}