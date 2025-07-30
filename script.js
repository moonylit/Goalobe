const Globe = window.Globe;

const myGlobe = Globe()
  (document.getElementById('globe-container'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .backgroundColor('#000')
  .showAtmosphere(true)
  .atmosphereColor('#3a228a')
  .atmosphereAltitude(0.25);

myGlobe.controls().autoRotate = true;
myGlobe.controls().autoRotateSpeed = 0.3;

fetch('https://raw.githubusercontent.com/mapsam/world-stadiums/master/data/stadiums.json')
  .then(res => res.json())
  .then(stadiums => {
    const points = stadiums.features.map(stadium => ({
      lat: stadium.geometry.coordinates[1],
      lng: stadium.geometry.coordinates[0],
      name: stadium.properties.name,
      capacity: stadium.properties.capacity
    }));

    myGlobe
      .pointsData(points)
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointAltitude(0.03)
      .pointColor(() => 'orange')
      .pointLabel(d => `
        <b>${d.name}</b><br>
        Capacity: ${d.capacity.toLocaleString()}
      `);
  })
  .catch(err => console.error('Error loading stadium data:', err));
