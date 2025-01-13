export type UserData = {
    email: string;
    name: string;
    phoneNumber: string;
    createdAt: string;
    lastLoginAt: string;
    lastSyncedAt?: string;
  };
  
  export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
  };
  
  export type TabParamList = {
    Home: undefined;
    Profile: undefined;
  };
  