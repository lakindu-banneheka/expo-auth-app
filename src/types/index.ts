export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  // Add any other user fields you need
  createdAt: string;
  updatedAt: string;
}
  
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};
