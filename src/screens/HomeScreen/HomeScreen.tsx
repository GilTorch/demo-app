import { useState } from "react";
import {
  Body1,
  Caption,
  Header1,
  ScreenContainer,
  ScreenSubContainer,
} from "components/atoms";
import { Spacer, Stack } from "tamagui";
import { HomeTabStackReactNavigationProps } from "navigation/HomeTabStackNavigator/types";
import { ErrorUI } from "components/molecules";
import { useTransactionsBottomSheetStore } from "services/zustand";
import { useLayoutAnimationOnChange, formatCurrency } from "utils";
import { CardCarousel } from "components/molecules/Carousel";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { TransactionsBottomSheet } from "./TransactionsBottomSheet";
import { MakePaymentButton } from "./MakePaymentButton";
import { useAccountDetailsForHome, useCardVisibility } from "./hooks";
import { GlassVideo } from "./GlassVideo";

type HomeScreenProps = HomeTabStackReactNavigationProps<"HomeScreen">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const {
    isFrontOfCardVisible,
    handleFlipCard,
    maybePrimaryCardData,
    loading: isPrimaryCardDataLoading,
  } = useCardVisibility(navigation);

  const {
    loading,
    error,
    currentBalance,
    creditLimit,
    refetch,
    hasExistingPaymentMethods,
    cardArt,
  } = useAccountDetailsForHome();

  const setHomeScreenContentY = useTransactionsBottomSheetStore(
    (state) => state.setHomeScreenContentY,
  );

  useLayoutAnimationOnChange(loading);

  const cards = [
    {
      index: 0,
      cardArt,
      isFrontOfCardVisible,
      frontImageUrl: cardArt?.frontImageUrl,
      backImageUrl: cardArt?.backImageUrl,
      formatedCardNumber: maybePrimaryCardData?.formattedCardNumber,
      cvv: maybePrimaryCardData?.cvv,
      expirationDate: maybePrimaryCardData?.formattedExpirationDate,
      isCardLoading: isPrimaryCardDataLoading,
      cardArtPresent: !!cardArt,
      loading: isPrimaryCardDataLoading,
      handleFlipCard,
      balance: currentBalance,
      creditLimit,
    },
    {
      index: 1,
      cardArt,
      isFrontOfCardVisible,
      frontImageUrl: cardArt?.frontImageUrl,
      backImageUrl: cardArt?.backImageUrl,
      formatedCardNumber: maybePrimaryCardData?.formattedCardNumber,
      cvv: maybePrimaryCardData?.cvv,
      expirationDate: maybePrimaryCardData?.formattedExpirationDate,
      isCardLoading: isPrimaryCardDataLoading,
      cardArtPresent: !!cardArt,
      loading: isPrimaryCardDataLoading,
      handleFlipCard,
      balance: 1000,
      creditLimit: 20000,
    },
    {
      index: 2,
      cardArt,
      isFrontOfCardVisible,
      frontImageUrl: cardArt?.frontImageUrl,
      backImageUrl: cardArt?.backImageUrl,
      formatedCardNumber: maybePrimaryCardData?.formattedCardNumber,
      cvv: maybePrimaryCardData?.cvv,
      expirationDate: maybePrimaryCardData?.formattedExpirationDate,
      isCardLoading: isPrimaryCardDataLoading,
      cardArtPresent: !!cardArt,
      loading: isPrimaryCardDataLoading,
      handleFlipCard,
      balance: 4000,
      creditLimit: 10000,
    },
    {
      index: 3,
      isNewCard: true,
    },
  ];

  const [currentCardInfo, setCurrentCardInfo] = useState(cards[0]);

  const onCardViewed = (viewableCard) => {
    if (viewableCard && viewableCard.item) {
      setCurrentCardInfo(viewableCard.item);
      console.log(`\nItem: ${viewableCard.item}\n`);
    }
  };

  const currencyCleanup = (value: any) =>
    isNaN(value) ? "$0.00" : formatCurrency(value);

  return (
    <>
      <ScreenContainer>
        <GlassVideo />
        {loading ? (
          <LoadingPlaceholder />
        ) : error ? (
          <ScreenSubContainer flex={1} justifyContent={"center"} alignItems={"center"}>
            <ErrorUI
              bodyText={"We couldn't load your account information."}
              handleTryAgain={refetch}
            />
          </ScreenSubContainer>
        ) : (
          <>
            <ScreenSubContainer alignItems={"center"}>
              <Spacer size={"$4"} />
              <Caption color={"$white70"}>{"BALANCE"}</Caption>
              <Spacer size={"$2"} />
              <Header1 textAlign={"center"} color={"white"}>
                {currencyCleanup(currentCardInfo.balance)}
              </Header1>
              <Spacer size={"$5"} />
              <Body1 color={"$white70"} fontWeight={"300"}>
                {`Credit limit: ${currencyCleanup(currentCardInfo.creditLimit)}`}
              </Body1>
              <Spacer size={"$6"} />
              <CardCarousel
                navigation={navigation}
                cards={cards}
                onCardViewed={onCardViewed}
              />
              <Spacer size={"$6"} />
              <MakePaymentButton hasExistingPaymentMethods={hasExistingPaymentMethods} />
              <Spacer size={"$6"} />
              <Stack onLayout={setHomeScreenContentY} />
            </ScreenSubContainer>
          </>
        )}
      </ScreenContainer>
      <TransactionsBottomSheet />
    </>
  );
};

export { HomeScreen };
