export const generateMockVehicles = (
  passengers: number,
  pickup: string,
  destination: string
) => {
  // This would fetch from an API in a real implementation
  // For now, return static mock data based on the passenger count
  
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const getRandomEta = () => getRandomInt(5, 25);
  const getRandomDistance = () => (getRandomInt(1, 8) + Math.random()).toFixed(1);
  const getRandomDemand = () => {
    const rand = Math.random();
    if (rand < 0.3) return 'low';
    if (rand < 0.7) return 'medium';
    return 'high';
  };
  
  const vehicles = [];
  
  // Always add jeeps
  vehicles.push({
    id: `jeep-${Date.now()}-1`,
    type: 'jeep',
    title: 'Mountain Jeep',
    price: 750 + getRandomInt(-50, 100),
    eta: getRandomEta(),
    distance: getRandomDistance(),
    seats: 6,
    demand: getRandomDemand(),
  });
  
  if (passengers <= 2) {
    // Add bikes for 1-2 passengers
    vehicles.push({
      id: `bike-${Date.now()}-1`,
      type: 'bike',
      title: 'Hill Bike',
      price: 350 + getRandomInt(-30, 50),
      eta: getRandomEta(),
      distance: getRandomDistance(),
      seats: 2,
      demand: getRandomDemand(),
    });
  }
  
  // Add shared rides
  vehicles.push({
    id: `shared-${Date.now()}-1`,
    type: 'shared',
    title: 'Shared Cab',
    price: 250 + getRandomInt(-20, 40),
    eta: getRandomEta(),
    distance: getRandomDistance(),
    seats: 3,
    demand: getRandomDemand(),
  });
  
  // Add luxury jeep option
  vehicles.push({
    id: `jeep-${Date.now()}-2`,
    type: 'jeep',
    title: 'Premium Jeep',
    price: 1200 + getRandomInt(-100, 200),
    eta: getRandomEta(),
    distance: getRandomDistance(),
    seats: 4,
    demand: getRandomDemand(),
  });
  
  return vehicles;
};