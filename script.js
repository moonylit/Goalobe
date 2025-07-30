const Globe = window.Globe;
const infoBox = document.getElementById('info-box');

const myGlobe = Globe()
  (document.getElementById('globe-container'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .backgroundColor('#000')
  .showAtmosphere(true)
  .atmosphereColor('lightskyblue')
  .atmosphereAltitude(0.25)
  .pointOfView({ lat: 35, lng: -45, altitude: 2 });

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
      .pointAltitude(0)
      .pointThreeObject(d => {
        const pinHeight = 3.5;
        const headRadius = 0.7;

        const group = new THREE.Group();

        const headMaterial = new THREE.MeshStandardMaterial({
          color: '#ff0000' ,
          metalness: 0.3,
          roughness: 0.4
        });
        const headGeometry = new THREE.SphereGeometry(headRadius, 16, 16);
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = pinHeight;
        group.add(head);

        const needleMaterial = new THREE.MeshStandardMaterial({
          color: 'silver',
          metalness: 0.6,
          roughness: 0.2
        });
        const needleGeometry = new THREE.ConeGeometry(0.15, pinHeight, 16);
        const needle = new THREE.Mesh(needleGeometry, needleMaterial);
        needle.position.y = pinHeight / 2;
        group.add(needle);
     
        return group;
      })
      .onPointClick(point => {
        infoBox.style.opacity = 1;
        infoBox.innerHTML = `<b>${point.name}</b><br>Capacity: ${point.capacity.toLocaleString()}`;
        
        myGlobe.pointOfView({ lat: point.lat, lng: point.lng, altitude: 0.5 }, 1500);
      });
  })
  .catch(err => console.error('Error loading stadium data:', err));

myGlobe.onGlobeClick(() => {
    infoBox.style.opacity = 0;
});
window.addEventListener('resize' , () => {
  const container = document.getElementbyId('globe-container');
  myGlobe.width(container.offsetWidth);
  myGlobe.height(container.offsetHeight);
});
