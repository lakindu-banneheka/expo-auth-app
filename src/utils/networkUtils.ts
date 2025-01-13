import NetInfo from '@react-native-community/netinfo';

export const checkConnectivity = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};
