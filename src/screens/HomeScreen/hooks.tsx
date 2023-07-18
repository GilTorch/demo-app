import { useCallback, useEffect, useMemo } from "react";
import { addSpacesToAmexNumber, formatCurrency, formatUTCString } from "utils";
import {
  useGetAccountDetailsForHomeQuery,
  useGetPrimaryCardDataLazyQuery,
  useGetPrimaryCardIdQuery,
} from "services/graphql/generated";
import { format, parse } from "date-fns";
import { useBooleanState } from "utils/hooks";
import { getApolloStatuses } from "services/apollo";
import { useIsFocused } from "@react-navigation/native";
import { Icon, Touchable } from "components/atoms";
import { HomeTabStackReactNavigationProps } from "navigation/HomeTabStackNavigator";

const useDetokenizedPrimaryCardData = () => {
  const { data: primaryCardIdResponse, loading } = useGetPrimaryCardIdQuery({
    fetchPolicy: "cache-and-network",
  });

  const primaryCardId =
    primaryCardIdResponse?.primaryCard?.__typename === "QueryPrimaryCardSuccess"
      ? primaryCardIdResponse.primaryCard.data.id
      : undefined;
  const [
    fetchPrimaryCardData,
    { data: primaryCardDataResponse, loading: isPrimaryCardDataLoading },
  ] = useGetPrimaryCardDataLazyQuery({
    fetchPolicy: "cache-and-network",
  });

  const primaryCardData =
    primaryCardDataResponse?.primaryCard?.__typename === "QueryPrimaryCardSuccess"
      ? primaryCardDataResponse.primaryCard.data
      : undefined;

  const cachedPrimaryCardIdFromFullData = primaryCardData?.id;

  const shouldFetchPrimaryCardData =
    primaryCardId === undefined
      ? false
      : cachedPrimaryCardIdFromFullData === undefined ||
        (primaryCardId && primaryCardId !== cachedPrimaryCardIdFromFullData);

  useEffect(() => {
    if (shouldFetchPrimaryCardData) {
      fetchPrimaryCardData();
    }
  }, [shouldFetchPrimaryCardData, fetchPrimaryCardData]);

  const maybePrimaryCardData = useMemo(() => {
    if (!primaryCardData) {
      return undefined;
    }

    const expirationDateObj = parse(
      primaryCardData.expirationDate,
      "MM/dd/yyyy",
      new Date(),
    );

    return {
      id: primaryCardData.id,
      formattedCardNumber: addSpacesToAmexNumber(primaryCardData.cardNumber.slice(0, -1)),
      cvv: primaryCardData.cvv,
      formattedExpirationDate: format(expirationDateObj, "MM/yy"),
    };
  }, [primaryCardData]);

  return {
    maybePrimaryCardData,
    loading: isPrimaryCardDataLoading || loading,
  };
};

const useCardVisibility = (
  navigation: HomeTabStackReactNavigationProps<"HomeScreen">["navigation"],
) => {
  const { state: isFrontOfCardVisible, toggleState: toggleIsFrontOfCardVisible } =
    useBooleanState(true);
  const { maybePrimaryCardData, loading } = useDetokenizedPrimaryCardData();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused && !isFrontOfCardVisible) {
      toggleIsFrontOfCardVisible();
    }
  }, [isFocused, isFrontOfCardVisible, toggleIsFrontOfCardVisible]);

  const handleFlipCard = useCallback(async () => {
    console.log("Handle that flip!");

    if (isFrontOfCardVisible) {
      toggleIsFrontOfCardVisible();
    } else {
      toggleIsFrontOfCardVisible();
    }
  }, [isFrontOfCardVisible, toggleIsFrontOfCardVisible]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Touchable onPress={handleFlipCard}>
          <Icon iconName={"show-card"} height={20} resizeMode={"contain"} />
        </Touchable>
      ),
    });
  }, [handleFlipCard, navigation]);

  return {
    isFrontOfCardVisible,
    maybePrimaryCardData,
    loading,
    handleFlipCard,
  };
};

const useAccountDetailsForHome = () => {
  const {
    data,
    refetch,
    loading: isLoading,
    networkStatus,
    error: apolloError,
  } = useGetAccountDetailsForHomeQuery();

  const { loading, error } = getApolloStatuses(networkStatus, isLoading, apolloError);

  const accountData =
    data?.account.__typename === "QueryAccountSuccess" ? data.account.data : undefined;
  const cardholderData =
    data?.cardholder?.__typename === "QueryCardholderSuccess"
      ? data.cardholder.data
      : undefined;
  const cardArtData =
    data?.cardArt.__typename === "QueryCardArtSuccess" ? data.cardArt.data : undefined;

  const hasExistingPaymentMethods =
    data?.paymentMethods.__typename === "QueryPaymentMethodsSuccess"
      ? !!data.paymentMethods.data.length
      : false;

  const currentBalance = useMemo(
    () =>
      accountData?.currentBalance !== undefined
        ? formatCurrency(accountData.currentBalance)
        : "Unknown balance",
    [accountData],
  );
  const creditLimit = useMemo(
    () =>
      accountData?.creditLimit !== undefined
        ? formatCurrency(accountData.creditLimit)
        : "Unknown credit limit",
    [accountData],
  );
  const dueDate = useMemo(
    () =>
      accountData?.dueDateUtc
        ? formatUTCString(accountData.dueDateUtc, "M/d")
        : "Unknown due date",
    [accountData],
  );
  const fullName = useMemo(
    () =>
      cardholderData
        ? `${cardholderData.firstName} ${cardholderData.lastName}`
        : "Unknown name",
    [cardholderData],
  );

  return {
    loading,
    error,
    refetch: useCallback(() => refetch(), [refetch]),
    currentBalance,
    creditLimit,
    dueDate,
    hasExistingPaymentMethods,
    cardArt: cardArtData,
    fullName,
  };
};

export { useAccountDetailsForHome, useCardVisibility, useDetokenizedPrimaryCardData };
