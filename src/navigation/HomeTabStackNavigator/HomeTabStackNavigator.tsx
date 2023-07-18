import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, Header3, Touchable } from "components/atoms";
import { FontAwesome5 } from "@expo/vector-icons";
import { HomeScreen, TransactionDetailScreen, NewCardScreen } from "screens";
import { useProfileDrawerStore } from "services/zustand";
import { getColorValue } from "theme/utils";
import { HomeTabStackNavigatorParamList } from "./types";
import { DISPUTE_REASON_TITLES } from "./constants";

const Stack = createNativeStackNavigator<HomeTabStackNavigatorParamList>();

const HomeTabStackNavigator = () => {
  const openProfileDrawer = useProfileDrawerStore((state) => state.openProfileDrawer);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: getColorValue("black"),
        },
        headerTintColor: getColorValue("white"),
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name={"HomeScreen"}
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <Touchable onPress={openProfileDrawer}>
              <Icon iconName={"user"} height={21} resizeMode={"contain"} />
            </Touchable>
          ),
        }}
      />
      <Stack.Screen
        name={"NewCardScreen"}
        component={NewCardScreen}
        options={({ navigation }) => ({
          headerTitle: "NEW VIRTUAL CARD",
          headerLeft: () => (
            <Touchable onPress={() => navigation.goBack()}>
              <FontAwesome5 name={"caret-left"} size={24} color={"white"} />
            </Touchable>
          ),
        })}
      />
      <Stack.Screen
        name={"TransactionDetailScreen"}
        component={TransactionDetailScreen}
      />
      {/* <Stack.Screen
        name={"DisputeReasonsScreen"}
        component={DisputeReasonsScreen}
        options={{
          headerTitle: () => <Header3 color={"$white"}>{"Report an Issue"}</Header3>,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name={"DisputeDetailsScreen"}
        component={DisputeDetailsScreen}
        options={({
          route: {
            params: { reason },
          },
        }) => ({
          headerTitle: () => (
            <Header3 color={"$white"}>{DISPUTE_REASON_TITLES[reason]}</Header3>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name={"DisputeFiledScreen"}
        component={DisputeFiledScreen}
        options={{
          gestureEnabled: false,
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen
        options={{
          headerTitle: () => <Header3 color={"$white"}>{"Make a payment"}</Header3>,
        }}
        name={"MakePaymentScreen"}
        component={MakePaymentScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: () => <Header3 color={"$white"}>{"Setup autopay"}</Header3>,
        }}
        name={"SetupAutoPayScreen"}
        component={SetupAutoPayScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: () => <Header3 color={"$white"}>{"AutoPay"}</Header3>,
        }}
        name={"AutoPayScreen"}
        component={AutoPayScreen}
      />
      <Stack.Screen name={"EditAutoPayScreen"} component={EditAutoPayScreen} />
      <Stack.Screen
        options={{
          headerTitle: () => <Header3 color={"$white"}>{"Settings"}</Header3>,
        }}
        name={"SettingsScreen"}
        component={SettingsScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: () => <Header3 color={"$white"}>{"Bank Account"}</Header3>,
        }}
        name={"BankAccountScreen"}
        component={BankAccountScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: () => <Header3 color={"$white"}>{"Bank Account Info"}</Header3>,
        }}
        name={"AddBankAccountScreen"}
        component={AddBankAccountScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: "",
          headerBackVisible: false,
          gestureEnabled: false,
        }}
        name={"ReceiptScreen"}
        component={ReceiptScreen}
      /> */}
    </Stack.Navigator>
  );
};

export { HomeTabStackNavigator };
