import { PropertyType } from '@propflow/types';
import { Property } from './property';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1234-abcd',
    address: '123 Garden Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    property_type: PropertyType.APARTMENT,
    status: 'SUBMITTED',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: 'u1',
    estimated_value: undefined,
  },
  {
    id: 'prop-5678-efgh',
    address: '45 Lake View Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    property_type: PropertyType.VILLA,
    status: 'VALUED',
    estimated_value: 25000000,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    user_id: 'u1',
  },
  {
    id: 'prop-9012-ijkl',
    address: '78 High Street',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    property_type: PropertyType.COMMERCIAL,
    status: 'FOLLOW_UP',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    user_id: 'u1',
    estimated_value: undefined,
  },
];

export const getMockProperty = (id: string): Property | undefined => {
  return MOCK_PROPERTIES.find((p) => p.id === id);
};
