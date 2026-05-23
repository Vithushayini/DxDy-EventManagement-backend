const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export async function enrichLocation(locationInput) {
  if (!locationInput?.name && !locationInput?.address && !locationInput?.city) {
    return null;
  }

  const query = [locationInput.name, locationInput.address, locationInput.city, locationInput.country]
    .filter(Boolean)
    .join(', ');

  const url = new URL(NOMINATIM_BASE_URL);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', query);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'smart-event-management-platform/1.0'
    }
  });

  if (!response.ok) {
    return null;
  }

  const results = await response.json();
  const match = results?.[0];
 console.log("queryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",query);
  console.log("map resultssssssssssssssssssssssssssssssssssssssss",results);
  
  if (!match) {
    return null;
  }

  return {
    name: match.display_name || locationInput.name,
    address: locationInput.address || null,
    city: locationInput.city || null,
    country: locationInput.country || null,
    coordinates: {
      lat: Number(match.lat),
      lng: Number(match.lon)
    },
    placeId: match.place_id ? String(match.place_id) : undefined,
    mapUrl: `https://www.openstreetmap.org/?mlat=${match.lat}&mlon=${match.lon}#map=16/${match.lat}/${match.lon}`
  };
}
