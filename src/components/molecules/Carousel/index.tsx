import { useState, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { FlipCard, FlipSide } from "components/molecules/FlipCard";
import { Stack } from "tamagui";
import {
  CARD_IMAGE_ASPECT_RATIO,
  CARD_IMAGE_WIDTH,
  styles,
} from "../../../screens/HomeScreen/styles";
import {
  CardNumbers,
  LoadingPlaceholder as CardNumbersLoadingPlaceholder,
} from "../../../screens/HomeScreen/CardNumbers";
import { RemoteImage, AspectImage, Touchable } from "../../../components/atoms";

const viewabilityConfig = {
  waitForInteraction: false,
  minimumViewTime: 500,
  itemVisiblePercentThreshold: 70,
};

const Carousel = ({ cards }) => {
  const carouselRef = useRef(null);

  const [viewable, setViewable] = useState(0);

  const onViewableItemsChanged = ({ changed }) => {
    const viewable = changed.filter((item) => item.isViewable)[0]?.index;

    console.log(viewable);
    setViewable(viewable);
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View style={carouselStyles.container}>
      <FlatList
        ref={carouselRef.current}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        horizontal={true}
        scrollEnabled={cards.length > 1}
        showsHorizontalScrollIndicator={false}
        snapToAlignment={"start"}
        decelerationRate={"fast"}
        snapToInterval={CARD_IMAGE_WIDTH - 7}
        data={cards}
        keyExtractor={({ index }) => index}
        renderItem={({ item: card }) => (
          <Touchable onPress={card?.handleFlipCard} pressStyle={undefined}>
            {card.cardArt ? (
              <FlipCard
                style={carouselStyles.carouselFlipCard}
                side={card.isFrontOfCardVisible ? FlipSide.FRONT : FlipSide.BACK}
                front={
                  <RemoteImage
                    width={CARD_IMAGE_WIDTH}
                    aspectRatio={CARD_IMAGE_ASPECT_RATIO}
                    uri={card.frontImageUrl}
                  />
                }
                back={
                  <Stack>
                    <RemoteImage
                      width={CARD_IMAGE_WIDTH}
                      aspectRatio={CARD_IMAGE_ASPECT_RATIO}
                      uri={card.backImageUrl}
                    />
                    {card.loading ? (
                      <CardNumbersLoadingPlaceholder />
                    ) : (
                      <CardNumbers
                        formattedCardNumber={card?.formattedCardNumber}
                        formattedExpirationDate={card?.formattedExpirationDate}
                        cvv={card?.cvv}
                      />
                    )}
                  </Stack>
                }
              />
            ) : (
              <AspectImage imageName={"default-hypercard"} width={CARD_IMAGE_WIDTH} />
            )}
          </Touchable>
        )}
      />
      <View style={carouselStyles.circles}>
        {cards.map((_: any, idx: number) => (
          <View
            key={idx}
            style={[
              {
                ...carouselStyles.circle,
              },
              viewable === idx ? carouselStyles.selectedCircle : {},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const carouselStyles = StyleSheet.create({
  container: {
    height: CARD_IMAGE_WIDTH / CARD_IMAGE_ASPECT_RATIO + 50,
  },
  carouselFlipCard: { ...styles.flipCard, marginRight: 16 },
  circle: {
    backgroundColor: "gray",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  selectedCircle: {
    backgroundColor: "white",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  circles: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Carousel };
