import { useState, useEffect } from "react";
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

interface CardArt {
  __typename?: string;
  backImageUrl: string;
  frontImageUrl: string;
}
interface DisplayedCard {
  index: number;
  cardArt?: CardArt;
  isFrontOfCardVisible?: boolean;
  frontImageUrl?: string;
  backImageUrl?: string;
  formatedCardNumber?: string;
  cvv?: string;
  handleFlipCard?: () => {};
  expirationDate?: string;
  isCardLoading?: boolean;
  cardArtPresent?: boolean;
  loading?: boolean;
  balance?: string;
  creditLimit?: string;
  isNewCard?: boolean;
}

const cardsData = [
  {
    index: 0,
    cardArt: {
      __typename: "CardArt",
      backImageUrl:
        "https://assets.development.hypercard.com/card-art/hypercard_primary_back.png",
      frontImageUrl:
        "https://assets.development.hypercard.com/card-art/hypercard_primary_front.png",
    },
    isFrontOfCardVisible: true,
    frontImageUrl:
      "https://assets.development.hypercard.com/card-art/hypercard_primary_front.png",
    backImageUrl:
      "https://assets.development.hypercard.com/card-art/hypercard_primary_back.png",
    isCardLoading: true,
    cardArtPresent: true,
    loading: true,
    balance: "$0.00",
    creditLimit: "$1,000.00",
  },
  {
    index: 1,
    isNewCard: true,
  },
];

const HomeScreen = ({ navigation, route }: HomeScreenProps) => {
  const {
    isFrontOfCardVisible,
    handleFlipCard,
    maybePrimaryCardData,
    loading: isPrimaryCardDataLoading,
  } = useCardVisibility(navigation);

  const { loading, error, refetch, cardArt, hasExistingPaymentMethods } =
    useAccountDetailsForHome();

  const [cardsToDisplay, setCardsToDisplay] = useState<DisplayedCard[]>(cardsData);
  const [currentCardInfo, setCurrentCardInfo] = useState<DisplayedCard | null>(null);
  const [cardIsFlipping, setCardIsFlipping] = useState(false);

  useEffect(() => {
    let primaryCardData = cardsData[0];

    primaryCardData = {
      ...cardsData[0],
      handleFlipCard,
    };
    setCurrentCardInfo(primaryCardData);
    setCardsToDisplay([{ ...primaryCardData }, { index: 1, isNewCard: true }]);
  }, [handleFlipCard]);

  const flipCard = (index: number) => {
    const cardsToDisplayCopy = cardsToDisplay;
    const currentCard = cardsToDisplayCopy[index];

    if (currentCard.isNewCard) {
      return;
    }

    setCardIsFlipping(true);
    const cardFrontVisible = currentCard.isFrontOfCardVisible;

    cardsToDisplayCopy[index].isFrontOfCardVisible = !cardFrontVisible;
    setCardsToDisplay(cardsToDisplayCopy);
    setCardIsFlipping(false);
  };

  useEffect(() => {
    const newCardData = route.params?.newCard;
    const cardsToDisplayCopy = cardsToDisplay.filter((card) => !card.isNewCard);

    if (newCardData) {
      const fakeCardData = {
        ...cardsData[0],
        isFrontOfCardVisible: true,
        index: cardsToDisplayCopy.length,
        balance: 4000,
        creditLimit: newCardData?.monthlyLimit,
      };

      cardsToDisplayCopy.push(fakeCardData);
      cardsToDisplayCopy.push({
        index: cardsToDisplayCopy.length,
        isNewCard: true,
      });
      setCardsToDisplay(cardsToDisplayCopy);
    }
  }, [route.params?.newCard]);

  const setHomeScreenContentY = useTransactionsBottomSheetStore(
    (state) => state.setHomeScreenContentY,
  );

  useLayoutAnimationOnChange(loading);

  const onCardViewed = (viewableCard) => {
    if (viewableCard && viewableCard.item) {
      setCurrentCardInfo(viewableCard.item);
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
                {currencyCleanup(currentCardInfo?.balance)}
              </Header1>
              <Spacer size={"$5"} />
              <Body1 color={"$white70"} fontWeight={"300"}>
                {`Credit limit: ${currencyCleanup(currentCardInfo?.creditLimit)}`}
              </Body1>
              <Spacer size={"$6"} />
              <CardCarousel
                navigation={navigation}
                cards={cardsToDisplay}
                onCardViewed={onCardViewed}
                handleFlipCard={flipCard}
                cardIsFlipping={cardArt}
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
