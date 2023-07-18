import { useState } from "react";
import {} from "expo-blur";
import { View, TextInput, Text, Switch, StyleSheet, ImageBackground } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { ScreenContainer } from "components/atoms";
import { PrimaryButton } from "components/molecules";
import { HomeTabStackReactNavigationProps } from "navigation/HomeTabStackNavigator/types";

type NewCardScreen = HomeTabStackReactNavigationProps<"NewCardScreen">;

const NewCardScreen = ({ navigation }: NewCardScreen) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cardHolderName: "",
      monthlyLimit: "",
      autoCancellation: false,
    },
  });

  const onSubmit = (data: {
    cardHoldername: string;
    monthlyLimit: string;
    autoCancellation: boolean;
  }) => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigation.navigate("HomeScreen", data);
    }, 3000);
  };

  return (
    <>
      <ScreenContainer>
        <ImageBackground
          source={{ uri: "https://legacy.reactjs.org/logo-og.png" }}
          resizeMode={"cover"}
          style={styles.backgroundImage}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{"Card name"}</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={"Cardholder name"}
                    placeholderTextColor={"rgba(255,255,255,0.5)"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name={"cardHolderName"}
              />
              {errors.cardHolderName && (
                <Text style={styles.error}>{"Cardholder name is required"}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{"Monthly limit"}</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder={"$ 0.00"}
                    keyboardType={"decimal-pad"}
                    placeholderTextColor={"rgba(255,255,255,0.5)"}
                    onChangeText={(text) => onChange(parseFloat(text))}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
                name={"monthlyLimit"}
              />
              {errors.monthlyLimit && (
                <Text style={styles.error}>{"Monthly limit is required"}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{"Auto Cancellation"}</Text>
              <View style={[styles.input, styles.autoCancellationInnerWrapper]}>
                <Text style={[styles.label, styles.autoCancellationInnerLabel]}>
                  {"Auto-Cancellation"}
                </Text>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      trackColor={{ false: "#767577", true: "rgba(0,255,0,0.5)" }}
                      thumbColor={"#f4f3f4"}
                      ios_backgroundColor={"#3e3e3e"}
                      onValueChange={onChange}
                      value={value}
                    />
                  )}
                  name={"autoCancellation"}
                />
              </View>
            </View>
            <View style={styles.primaryButtonContainer}>
              <PrimaryButton
                onPress={handleSubmit(onSubmit)}
                style={styles.primaryButton}
              >
                {`Creat${isSubmitting ? "ing" : "e"} card${isSubmitting ? "..." : ""}`}
              </PrimaryButton>
            </View>
          </View>
        </ImageBackground>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  formContainer: {
    marginHorizontal: 15,
  },
  label: {
    color: "white",
    marginBottom: 10,
  },
  inputContainer: {
    marginTop: 35,
  },
  input: {
    backgroundColor: "#555",
    height: 50,
    borderRadius: 5,
    paddingLeft: 10,
  },
  primaryButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  autoCancellationContainer: {
    marginTop: 10,
  },
  autoCancellationInnerWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  autoCancellationInnerLabel: {
    marginTop: 10,
  },
  primaryButtonContainer: {
    marginTop: 40,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export { NewCardScreen };
