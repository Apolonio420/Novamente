export const removeBackground = async (imageUrl: string): Promise<string> => {
  // Implementación real usando la API de remove.bg
  const formData = new FormData();
  formData.append('image_url', imageUrl);
  
  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.REMOVE_BG_API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error removing background');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}; 