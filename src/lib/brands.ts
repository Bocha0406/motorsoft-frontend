export interface Brand {
  id: string;
  name: string;
  slug: string;
  region: 'europe' | 'america' | 'asia' | 'china';
  logo?: string;
}

export const brands: Brand[] = [
  // Европа
  { id: '1', name: 'Alfa Romeo', slug: 'alfa-romeo', region: 'europe' },
  { id: '2', name: 'Audi', slug: 'audi', region: 'europe' },
  { id: '3', name: 'BMW', slug: 'bmw', region: 'europe' },
  { id: '4', name: 'Citroën', slug: 'citroen', region: 'europe' },
  { id: '5', name: 'Fiat', slug: 'fiat', region: 'europe' },
  { id: '6', name: 'Jaguar', slug: 'jaguar', region: 'europe' },
  { id: '7', name: 'Lamborghini', slug: 'lamborghini', region: 'europe' },
  { id: '8', name: 'Land Rover', slug: 'land-rover', region: 'europe' },
  { id: '9', name: 'Mercedes-Benz', slug: 'mercedes', region: 'europe' },
  { id: '10', name: 'Mini', slug: 'mini', region: 'europe' },
  { id: '11', name: 'Opel', slug: 'opel', region: 'europe' },
  { id: '12', name: 'Peugeot', slug: 'peugeot', region: 'europe' },
  { id: '13', name: 'Porsche', slug: 'porsche', region: 'europe' },
  { id: '14', name: 'Renault', slug: 'renault', region: 'europe' },
  { id: '15', name: 'Saab', slug: 'saab', region: 'europe' },
  { id: '16', name: 'Seat', slug: 'seat', region: 'europe' },
  { id: '17', name: 'Škoda', slug: 'skoda', region: 'europe' },
  { id: '18', name: 'Smart', slug: 'smart', region: 'europe' },
  { id: '19', name: 'Volkswagen', slug: 'volkswagen', region: 'europe' },
  { id: '20', name: 'Volvo', slug: 'volvo', region: 'europe' },

  // Америка
  { id: '21', name: 'Cadillac', slug: 'cadillac', region: 'america' },
  { id: '22', name: 'Chevrolet', slug: 'chevrolet', region: 'america' },
  { id: '23', name: 'Chrysler', slug: 'chrysler', region: 'america' },
  { id: '24', name: 'Dodge', slug: 'dodge', region: 'america' },
  { id: '25', name: 'Ford', slug: 'ford', region: 'america' },
  { id: '26', name: 'Jeep', slug: 'jeep', region: 'america' },

  // Азия (Япония/Корея)
  { id: '27', name: 'Honda', slug: 'honda', region: 'asia' },
  { id: '28', name: 'Hyundai', slug: 'hyundai', region: 'asia' },
  { id: '29', name: 'Infiniti', slug: 'infiniti', region: 'asia' },
  { id: '30', name: 'Isuzu', slug: 'isuzu', region: 'asia' },
  { id: '31', name: 'Kia', slug: 'kia', region: 'asia' },
  { id: '32', name: 'Mazda', slug: 'mazda', region: 'asia' },
  { id: '33', name: 'Mitsubishi', slug: 'mitsubishi', region: 'asia' },
  { id: '34', name: 'Nissan', slug: 'nissan', region: 'asia' },
  { id: '35', name: 'Ssangyong', slug: 'ssangyong', region: 'asia' },
  { id: '36', name: 'Subaru', slug: 'subaru', region: 'asia' },
  { id: '37', name: 'Suzuki', slug: 'suzuki', region: 'asia' },
  { id: '38', name: 'Toyota', slug: 'toyota', region: 'asia' },

  // Китай
  { id: '39', name: 'Changan', slug: 'changan', region: 'china' },
  { id: '40', name: 'Chery', slug: 'chery', region: 'china' },
  { id: '41', name: 'Exeed', slug: 'exeed', region: 'china' },
  { id: '42', name: 'Geely', slug: 'geely', region: 'china' },
  { id: '43', name: 'Great Wall', slug: 'great-wall', region: 'china' },
  { id: '44', name: 'Haval', slug: 'haval', region: 'china' },
  { id: '45', name: 'JAC', slug: 'jac', region: 'china' },
  { id: '46', name: 'Jetour', slug: 'jetour', region: 'china' },
  { id: '47', name: 'Omoda', slug: 'omoda', region: 'china' },
  { id: '48', name: 'Tank', slug: 'tank', region: 'china' },
];

export const getBrandsByRegion = (region: Brand['region']) => {
  return brands.filter((brand) => brand.region === region);
};

export const getBrandBySlug = (slug: string) => {
  return brands.find((brand) => brand.slug === slug);
};

export const regionNames = {
  europe: 'Европа',
  america: 'Америка',
  asia: 'Азия',
  china: 'Китай',
} as const;
