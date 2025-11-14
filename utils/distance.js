
import ServiceArea from "../models/serviceArea.js";

// export function getDistanceKm(lat1, lon1, lat2, lon2) {
//   const R = 6371;
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;

//   const a =
//     Math.sin(dLat/2) ** 2 +
//     Math.cos(lat1*Math.PI/180) *
//     Math.cos(lat2*Math.PI/180) *
//     Math.sin(dLon/2) ** 2;

//   return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
// }
// utils/distance.js
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
}

export const checkServiceability = async (userLocation) => {
  const areas = await ServiceArea.find();

  for (const area of areas) {
    const distance = calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      area.center.lat,
      area.center.lng
    );

    if (distance <= area.radiusKm) {
      return true; // serviceable
    }
  }

  return false; // not serviceable
};
