import React, { Component } from "react";
import { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import {
  Container,
  Header,
  Spinner,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Title,
  Button,
  Left,
  Body,
  Right,
  View,
} from "native-base";
import { useIsFocused } from "@react-navigation/native";

import Colors from "../ColorCodes/Colors";
//import { useSelector, useDispatch } from "react-redux";
import * as ApiDataAction from "../store/actions/payment";
//import ViewShot from "react-native-view-shot";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import URL from "../api/ApiURL";
import NumberFormat from "react-number-format";
// import MyHeader from "../../components/MyHeader";

const PaymentMethods = ({ navigation, route }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const packageId = id;
  console.log("Package Id", packageId);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paypal, setPaypal] = useState(false);
  const [visa, setVisa] = useState(false);
  const [master, setMaster] = useState(true);
  const [stripe, setStripe] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [brand, setBrand] = useState("");
  const [last4, setLast4] = useState("");
  const [disable, setDisable] = useState(true);
  const [check, setCheck] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState(new Date());
  const RiderId = useSelector((state) => state.ApiData.RiderId);
  // const Brand=useSelector(state=>state.Payment.brand);
  var reg = /^\d+$/;
  // const Last4=useSelector(state=>state.Payment.last4);
  var datee;
  var monthh;
  var yearr;

  var hourss;
  var minn;
  var secc;

  useEffect(() => {
    setIsLoading(false);

    setLoading(true);
    fetch(URL + "/payment/show_card/" + RiderId + "/?user_type=delivery_person")
      // fetch(URL+'/client_app/clients_list/33/')
      .then(async (response) => {
        let data = await response.json();
        console.log("Show Card", data);
        console.log("Show Card Code", response.status);
        if (response.status == 200) {
          // dispatch(ApiDataAction.SetCard(data.card.card_brand,data.card.last4));

          if (data.card.card_brand == "visa") {
            setVisa(true);
            setMaster(false);
          } else {
            setVisa(false);
            setMaster(true);
          }
          setBrand(data.card.card_brand);
          setLast4(data.card.last4);
          setDisable(false);
          setCheck(true);
          setCardNumber("********" + data.card.last4);
          setCvc("***");
          setMonth("**");
          setYear("**");
          setLoading(false);
        } else {
          setLoading(false);

          // alert(data.message)
        }
      })
      .catch((error) => console.error(error));

    // datee = new Date().getDate(); //Current Date
    // monthh = new Date().getMonth() + 1; //Current Month
    // yearr = new Date().getFullYear(); //Current Year
    // hourss = new Date().getHours(); //Current Hours
    // minn = new Date().getMinutes(); //Current Minutes
    // secc = new Date().getSeconds(); //Current Seconds
    // console.log("yearrr",yearr);
    // console.log("mothh",monthh);
  }, [isFocused]);

  const togglePaypal = () => {
    setPaypal(true);
    if (!paypal) {
      setMaster(false);
      setVisa(false);
      setStripe(false);
    }
  };
  const toggleMaster = () => {
    setMaster(true);
    if (!master) {
      setPaypal(false);
      setVisa(false);
      setStripe(false);
    }
  };
  const toggleStripe = () => {
    setStripe(true);
    if (!stripe) {
      setPaypal(false);
      setVisa(false);
      setMaster(false);
    }
  };
  const toggleVisa = () => {
    setVisa(true);
    if (!visa) {
      setPaypal(false);
      setStripe(false);
      setMaster(false);
    }
  };

  const payment = () => {
    console.log("RiderId", RiderId);
    console.log("packageId", packageId);
    fetch(URL + "/payment/make_payment/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: RiderId,
        user_type: "delivery_person",
        package_id: packageId,
      }),
    })
      .then(async (response) => {
        let data = await response.json();
        console.log("MAke Payment", data);
        console.log("Make PAyment Code", response.status);
        if (response.status == 200) {
          alert("Transaction is successful");
          //  dispatch(DeliveryNoteAction.AllClear(1)),
          // checkPermission();
          // Linking.openURL(downloadInvoice);
          // payment();
          //  console.log("Its work")
          //  alert("Invoice Send successfully");
          //  navigation.navigate("Dashboard");

          //   setCount(0);
          setIsLoading(false);

          navigation.navigate("Dashboard");
        } else {
          setIsLoading(false);

          alert("There was a request load on server, please try again later");
        }

        //send_Verification_Code()
        // navigation.navigate("VerificationCode" , {Email : email , Phone_No : phoneNumber})
      })
      .catch((error) => console.log("Something went wrong", error));
  };
  // const checkCardNumber=()=>{
  //     if(cardNumber!=""){

  //     }
  // }
  // const checkCvc=()=>{
  //     if(cardNumber!=""){

  //     }
  // }

  const checkCardNumber = () => {
    if (cardNumber != "") {
      if (reg.test(cardNumber) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid card number");
        setCardNumber("");
        // setButtonCheck(false);
        // setAccountNumberMsg1(true);
        // setLoading(false);
        return false;
      }
      if (cardNumber.length < 16) {
        alert("Invalid card number");
        setCardNumber("");
        // setToastMessage("Password limit should be Greater than 8 Digits");
      }
    }
  };

  const checkCvc = () => {
    if (cvc != "") {
      if (reg.test(cvc) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid cvc number");
        setCvc("");
        // setButtonCheck(false);
        // setAccountNumberMsg1(true);
        // setLoading(false);
        return false;
      }
      if (cvc.length < 3) {
        // setButtonCheck(false);
        // setAccountNumberMsg2(true);
        // setLoading(false);
        alert("Invalid cvc number");
        setCvc("");
        // setToastMessage("Password limit should be Greater than 8 Digits");
      }
    }
  };

  const checkMonth = () => {
    if (month != "") {
      if (reg.test(month) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid month");
        setMonth("");
        return false;
      }
    }
  };

  const checkYear = () => {
    if (year != "") {
      if (reg.test(year) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid year");
        setYear("");
        return false;
      }
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    console.log("RiderId", RiderId);
    console.log("Card Number", cardNumber);
    console.log("cvc:", cvc);
    console.log("exp", expiryDate);
    monthh = new Date().getMonth() + 1; //Current Month
    yearr = new Date().getFullYear(); //Current Year
    console.log("yearrrrrrrrrrrrrrrrr", yearr);
    console.log("mothhhhhhhhhhhhhhhhh", monthh);

    if (check != true) {
      if (month > 12 || month < 1) {
        setIsLoading(false);
        alert("Invalid Month");
      } else if (year < 21) {
        setIsLoading(false);
        alert("Invalid Year");
      } else if (month < monthh && "20" + year == yearr) {
        setIsLoading(false);
        alert("Invalid expiry date");
      } else if (cardNumber.length < 16) {
        setIsLoading(false);
        alert("Invalid card number");
      } else if (cvc.length < 3) {
        setIsLoading(false);
        alert("Invalid cvc number");
      } else if (reg.test(year) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid year");
        setYear("");
        return false;
      } else if (reg.test(month) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid Month");
        setMonth("");
        return false;
      } else if (reg.test(cvc) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid cvc number");
        setCvc("");
        // setButtonCheck(false);
        // setAccountNumberMsg1(true);
        // setLoading(false);
        return false;
      } else if (reg.test(cardNumber) === false) {
        // setToastMessage("Email is Not Correct");
        alert("Invalid card number");
        setCardNumber("");
        // setButtonCheck(false);
        // setAccountNumberMsg1(true);
        // setLoading(false);
        return false;
      } else {
        if (cardNumber != "" && cvc != "" && month != "" && year != "") {
          fetch(URL + "/payment/save_stripe_info/", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              card_number: cardNumber,
              cvc: cvc,
              expiry_date: month + "/20" + year,
              id: RiderId,
              user_type: "delivery_person",
            }),
          })
            .then(async (response) => {
              let data = await response.json();
              console.log("save_stripe", data);
              console.log("save_stripe", response.status);
              if (response.status == 200) {
                setCardNumber("");
                setCvc("");
                setExpiryDate("");
                setMonth("");
                setYear("");
                //    alert("its work");
                payment();
                //  navigation.navigate("VerificationCode" , {Email : email , Phone_No : formattedValue})
              } else {
                //  setToastMessage(data.message)
                setIsLoading(false);
                alert(data.message);
              }
            })
            .catch((error) => console.log("Something went wrong", error));
        } else {
          alert("Please enter all fields");
        }
      }
    } else {
      payment();
    }
  };

  var reg = /^\d+$/;

  return (
    <View style={{ flex: 1, height: "100%" }}>
      {loading ? (
        <Spinner color={Colors.themeColor} size={50} />
      ) : (
        <>
          <View style={{ height: "20%" }}>
            <ImageBackground
              source={require("../assets/Splash.jpg")}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Text
style={{
color: "white",
fontSize: 25,
fontWeight: "bold",
letterSpacing: 2,
}}
>
PAYMENT METHODS
</Text> */}
              {/* <View
style={{
borderBottomColor: "white",
borderBottomWidth: 0.5,
width: "20%",
marginTop: 10,
}}
></View> */}
              <Text
                style={{
                  color: Colors.yellowColor,
                  // marginTop: 20,
                  fontSize: 16,
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                Enter Your Bank Card Details
              </Text>
            </ImageBackground>
          </View>

          <View
            style={{
              height: "20%",
              width: "50%",
              height: 60,
              backgroundColor: "white",
              alignSelf: "center",
              borderRadius: 30,
              flexDirection: "row",
              marginTop: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              justifyContent: "space-around",
            }}
          >
            {/* <TouchableOpacity onPress={togglePaypal}>
            {paypal?
            <Image source={require("../assets/c_paypal.png")} style={{width:60,height:60}} />:
            <Image source={require("../assets/paypal.png")} style={{width:60,height:60}} />}

        </TouchableOpacity> */}
            <TouchableOpacity disabled={check} onPress={toggleMaster}>
              {master ? (
                <Image
                  source={require("../assets/c_master.png")}
                  style={{ width: 60, height: 60 }}
                />
              ) : (
                <Image
                  source={require("../assets/master.png")}
                  style={{ width: 60, height: 60 }}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity disabled={check} onPress={toggleVisa}>
              {visa ? (
                <Image
                  source={require("../assets/c_visa.png")}
                  style={{ width: 60, height: 60 }}
                />
              ) : (
                <Image
                  source={require("../assets/visa.png")}
                  style={{ width: 60, height: 60 }}
                />
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={toggleStripe}>
        {stripe?
            <Image source={require("../assets/c_stripe.png")} style={{width:60,height:60}} />:
            <Image source={require("../assets/stripe.png")} style={{width:60,height:60}} />}

        </TouchableOpacity> */}
          </View>

          <View style={{ height: "60%", justifyContent: "center" }}>
            {/* <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50}> */}
            <ScrollView style={{ marginTop: "10%" }}>
              <View style={styles.inputArea}>
                <TextInput
                  editable={disable}
                  style={{ width: 250 }}
                  placeholder="Card Number"
                  // secureTextEntry={securePass}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  required={true}
                  placeholderTextColor={Colors.textGreyColor}
                  maxLength={16}
                  errorMessage="Please enter Minimum 6 characters password"
                  value={cardNumber}
                  onChangeText={(value) => setCardNumber(value)}
                  onEndEditing={checkCardNumber}
                  initialValue=""
                />
              </View>
              <View style={styles.inputArea}>
                <TextInput
                  editable={disable}
                  style={{ width: 250 }}
                  placeholder="CVC Number"
                  keyboardType="number-pad"
                  // secureTextEntry={securePass}
                  autoCapitalize="none"
                  required={true}
                  placeholderTextColor={Colors.textGreyColor}
                  maxLength={3}
                  errorMessage="Please enter Minimum 6 characters password"
                  value={cvc}
                  onChangeText={(value) => {
                    setCvc(value);
                  }}
                  onEndEditing={checkCvc}
                  initialValue=""
                />
              </View>
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <View style={styles.d_inputArea}>
                  <TextInput
                    editable={disable}
                    style={{ width: 250 }}
                    placeholder="MM"
                    // secureTextEntry={securePass}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    required={true}
                    placeholderTextColor={Colors.textGreyColor}
                    maxLength={2}
                    errorMessage="Please enter Minimum 6 characters password"
                    value={month}
                    onChangeText={(value) => setMonth(value)}
                    onEndEditing={checkMonth}
                    initialValue=""
                  />
                </View>
                <View style={{ ...styles.d_inputArea, marginLeft: 10 }}>
                  <TextInput
                    editable={disable}
                    style={{ width: 250 }}
                    placeholder="YY"
                    // secureTextEntry={securePass}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    required={true}
                    placeholderTextColor={Colors.textGreyColor}
                    maxLength={2}
                    errorMessage="Please enter Minimum 6 characters password"
                    value={year}
                    onChangeText={(value) => setYear(value)}
                    onEndEditing={checkYear}
                    initialValue=""
                  />
                </View>
              </View>

              <TouchableOpacity onPress={onSubmit} style={styles.button}>
                {isLoading ? (
                  <Spinner color="white" size={30} />
                ) : check ? (
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    BUY
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    SUBMIT
                  </Text>
                )}
              </TouchableOpacity>

              <View
                style={{
                  width: "95%",
                  //   height: "30%",
                  alignSelf: "center",
                  // borderColor: "gray",
                  // borderWidth: 0.5,
                  // flexDirection: "row",
                  alignItems: "center",

                  padding: 20,
                }}
              >
                <View>
                  <FontAwesome
                    style={{ alignItems: "center" }}
                    name="bank"
                    color={Colors.themeColor}
                    size={50}
                  />
                </View>
                <View style={{ width: "80%" }}>
                  <Text
                    style={{
                      // marginLeft: 15,
                      fontSize: 12,
                      width: "100%",
                      alignSelf: "center",
                      textAlign: "center",
                      fontWeight: "500",
                      marginTop: 10,

                      // alignItems: "center",
                    }}
                  >
                    If Credit/Debit card facility is not available you may
                    please transfer money to the following bank account of
                    Orddel Limited. Thank you.
                  </Text>
                  <View
                    style={{
                      backgroundColor: Colors.themeColor,
                      width: "90%",
                      borderRadius: 10,
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 120,
                      alignSelf: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        // marginLeft: 15,
                        fontSize: 20,
                        width: "80%",
                        alignSelf: "center",
                        textAlign: "center",
                        fontWeight: "700",
                        // marginTop: 40,
                        textDecorationLine: "underline",

                        // alignItems: "center",
                      }}
                    >
                      Orddel Limited
                    </Text>
                    <Text
                      style={{
                        color: "white",
                        // marginLeft: 15,
                        fontSize: 18,
                        width: "80%",
                        alignSelf: "center",
                        textAlign: "center",
                        fontWeight: "700",
                        marginTop: 5,
                        // textDecorationLine: "underline",

                        // alignItems: "center",
                      }}
                    >
                      Starling
                    </Text>
                    <Text
                      style={{
                        // marginLeft: 15,
                        marginTop: 10,
                        color: "white",

                        fontSize: 15,
                        width: "80%",
                        alignSelf: "center",
                        textAlign: "center",
                        fontWeight: "600",
                        // alignItems: "center",
                      }}
                    >
                      Sort Code: 60 83 71
                    </Text>
                    <Text
                      style={{
                        // marginLeft: 15,
                        color: "white",

                        fontSize: 15,
                        width: "80%",
                        alignSelf: "center",
                        textAlign: "center",
                        fontWeight: "600",
                        // alignItems: "center",
                      }}
                    >
                      Account No.: 2272 5363
                    </Text>
                  </View>
                </View>
              </View>
              {/* </KeyboardAvoidingView> */}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  name_inputArea: {
    height: 40,
    width: 130,

    backgroundColor: "#E2E2E2",
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  name2_inputArea: {
    marginLeft: 20,
    marginVertical: 10,
    height: 40,
    width: 135,
    backgroundColor: "#E2E2E2",
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  inputArea: {
    marginVertical: 5,
    alignSelf: "center",
    height: 40,
    width: 300,
    backgroundColor: "#E2E2E2",
    borderRadius: 25,
    paddingHorizontal: 30,
    flexDirection: "row",
  },
  d_inputArea: {
    marginVertical: 5,
    alignSelf: "center",
    height: 40,
    width: 145,
    backgroundColor: "#E2E2E2",
    borderRadius: 25,
    paddingHorizontal: 30,
    flexDirection: "row",
  },
  button: {
    height: 40,
    width: 130,
    backgroundColor: "#EE0202",
    justifyContent: "center",
    borderRadius: 25,
    marginVertical: 20,
    alignSelf: "center",
  },
});
export default PaymentMethods;
