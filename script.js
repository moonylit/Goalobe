const Globe = window.Globe;
const myGlobe = Globe()
  (document.getElementById('globe-container'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .backgroundColor('#000')
  .showAtmosphere(true)
  .atmosphereColor('#3a228a')
  .atmosphereAltitude(0.25);

// 👉 Dynamically load stadium data
fetch('https://raw.githubusercontent.com/mapsam/world-stadiums/master/data/stadiums.json')
  .then(res => res.json())
  .then(data => {
    const points = data.map(s => ({
      lat: parseFloat(s.latitude),
      lng: parseFloat(s.longitude),
      name: s.name
    }));

    myGlobe
      .pointsData(points)
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointAltitude(0.03)
      .pointColor(() => 'orange')
      .pointLabel(d => d.name);
  })
  .catch(err => console.error('Error loading stadium data', err));
