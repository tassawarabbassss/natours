/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidGFzd2FyYWJiYXNzc3MiLCJhIjoiY2w1dHV5NXgxMDlocDNqbGFla283NjlleiJ9.l5ukIHd4C6HXMTVdDop-eA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/taswarabbassss/cl5tvq8mp000y15o5irlwupxd',
    scrollZoom: false
    // center: [73.028725, 33.65939],
    // zoom: 7
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // Extends Map bounds to include current locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
