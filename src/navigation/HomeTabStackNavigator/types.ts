import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PaymentType, DisputeReason } from "services/graphql/generated";

type HomeTabStackNavigatorParamList = {
  ReceiptScreen: // TODO: possibly support being able to show a snapshot of the User's account for a given transaction
  {
    paymentAmount: number;
    paymentDate: "Today";
    bankAccount: {
      name: string;
      last4Digits: string;
    };
  };
  MakePaymentScreen: undefined;
  AutoPayScreen: undefined;
  SetupAutoPayScreen: undefined;
  EditAutoPayScreen: {
    methodId: string;
    paymentScheduleId: string;
    paymentType: PaymentType;
  };
  BankAccountScreen: undefined;
  SettingsScreen: undefined;
  LostOrStolenCardScreen: undefined;
  AddBankAccountScreen: {
    screenToNavigateToOnSuccess:
      | keyof Pick<
          HomeTabStackNavigatorParamList,
          "BankAccountScreen" | "SetupAutoPayScreen"
        >
      | undefined;
  };
  HomeScreen: undefined;
  NewCardScreen: undefined;
  TransactionDetailScreen: {
    transactionId: number;
  };
  DisputeReasonsScreen: {
    transactionId: number;
  };
  DisputeDetailsScreen: {
    transactionId: number;
    reason: DisputeReason;
  };
  DisputeFiledScreen: undefined;
  HelpCenterScreen: undefined;
};

type HomeTabStackNavigatorRouteName = keyof HomeTabStackNavigatorParamList;

type HomeTabStackReactNavigationProps<S extends HomeTabStackNavigatorRouteName> =
  NativeStackScreenProps<HomeTabStackNavigatorParamList, S>;

export type { HomeTabStackNavigatorParamList, HomeTabStackReactNavigationProps };
