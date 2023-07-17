export default {
  name: "hypercard-demo-app",
  slug: "hypercard-demo-app",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    backgroundColor: "#000000",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/a864a1c2-0fac-4b13-af9b-df23418e2fcd",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "fakeco.test.demoapp",
  },
  android: {
    package: "fakeco.test.demoapp",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000",
    },
  },
  updates: {
    url: "https://u.expo.dev/a864a1c2-0fac-4b13-af9b-df23418e2fcd",
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          flipper: true,
        },
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "a864a1c2-0fac-4b13-af9b-df23418e2fcd",
    },
  },
  owner: "gilbert2020",
  jsEngine: "hermes",
};
