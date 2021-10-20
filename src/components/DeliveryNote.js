import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  LogBox,
  TextInput,
  BackHandler,
  Platform,
  PermissionsAndroid,
  Linking,
  Modal,
  Pressable,
} from "react-native";

import {
  Container,
  Header,
  Spinner,
  Card,
  CardItem,
  Title,
  Thumbnail,
  Item,
  Content,
  Text,
  Button,
  Left,
  Body,
  Right,
  View,
} from "native-base";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
//   import * as DeliveryNoteAction from '../store/actions/DeliveryNote';
import * as DeliveryNoteAction from "../store/actions/DeliveryNote";
import { useIsFocused } from "@react-navigation/native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import DropdownAlert from "react-native-dropdownalert";
//import ViewShot from "react-native-view-shot";
import Colors from "../ColorCodes/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import URL from "../api/ApiURL";
import { useSelector, useDispatch } from "react-redux";
import * as ApiAction from "../store/actions/ApiData";
import MyHeader from "../components/MyHeader";
import DeliveryCart from "../components/DeliveryCart";
import { BottomSheet } from "react-native-btr";
import * as OrderBox from "../store/actions/OrderBox";
import RNFetchBlob from "rn-fetch-blob";
import DeliveryNoteItem from "../components/DeliveryNoteItem";

function DeliveryNote({ navigation, route }) {
  const dispatch = useDispatch();

  const {
    OID,
    OrderBoxId,
    totalQuantity,
    data,
    dataDetail,
    image,
  } = route.params;
  //    const packages=Packages;
  const [boxData, setBoxData] = useState("");
  const [boxDetail, setBoxDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [dataStatus, setDataStatus] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [note, setNote] = useState("");
  const [disvisible, setDisvisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deliveryNoteData, setDeliveryNoteData] = useState("");

  const [DN, setDN] = useState("");
  const RiderImage = useSelector((state) => state.ApiData.RiderImage);
  const RiderAddress = useSelector((state) => state.ApiData.RiderAddress);
  const RiderName = useSelector((state) => state.ApiData.RiderName);

  var downloadInvoice =
    URL + "/payment/generate_delivery_note_pdf/" + id + "/?download=true";
  console.log("dataaaaaaaaaaaaaaaaaaaaa", RiderAddress);
  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  // const OId=OrderId;
  // const OrderBoxId=OrderBox;
  // const totalQuantity=Quantity;
  const id = OID;
  const d_orderBoxId = OrderBoxId;
  const SubQuantity = totalQuantity;
  const dataDetails = dataDetail;
  const ClientImage = image;
  console.log("fromddddd", ClientImage);
  const setting = () => {
    toggleBottomNavigationView();

    // if(dataStatus=="in_progress")
    // {

    // }
  };

  const newTotalQty = useSelector((state) => state.DeliveryNote.totalQtty);

  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.DeliveryNote.items) {
      transformedCartItems.push({
        product_id: key,
        // id:items[key],
        // product_id:state.DeliveryNote.items[key].product_id,
        purchased_qty: state.DeliveryNote.items[key].purchased_qty,
      });
    }
    return transformedCartItems.sort((a, b) => (a.id > b.id ? 1 : -1));
  });
  //   console.log("Delivery Note CartItem::::::::::::::::::::::::::::::::",cartItems)
  const changeStatus = () => {
    fetch(URL + "/delivery_person/update_order_status/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: id,
        delivery_person_action: "delivered",
      }),
    })
      .then(async (response) => {
        let data = await response.json();

        //    console.log("signup",response.status)
        if (response.status == 200) {
          console.log("status changed");
          dispatch(OrderBox.clear());
          navigation.navigate("Invoice", { orderBoxId: d_orderBoxId, OID: id });

          // setIsLoading(false)
          // navigation.navigate("Dashboard")
        } else {
          alert(data.detail);
        }
        //send_Verification_Code()
        // navigation.navigate("VerificationCode" , {Email : email , Phone_No : phoneNumber})
      })
      .catch((error) => console.log("Something went wrong", error));
  };
  const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === "ios") {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message: "App needs access to your storage to download Photos",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log("Storage Permission Granted.");
          downloadImage();
        } else {
          // If permission denied then show alert
          alert("Storage permission not granted");
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  // const downloadImage = () => {

  //   //fetch('GET',URL+'/payment/generate_invoice_pdf/'+id+'/?download=true')
  //   //await Linking.openURL( "ec2-13-59-209-70.us-east-2.compute.amazonaws.com:8000/payment/generate_invoice_pdf/"+id+"/?download=true");

  //   await Linking.openURL('GET',URL+"/payment/generate_delivery_note_pdf/"+id+"/?download=true")
  //   .then((res) => {
  //     // if(res.status==200)
  //     // {

  //     //   console.log("Success");

  //     // }

  //     })
  //   .catch((error)=>{console.log(error.message,'error massage.........'); })

  // }

  // const downloadImage = () => {
  //   // Main function to download the image

  //   // To add the time suffix in filename
  //   let date = new Date();
  //   // Image URL which we want to download
  //   let image_URL = downloadInvoice;
  //   // Getting the extention of the file
  //   let ext = getExtention(image_URL);
  //   // ext = '.' + ext[0];
  //   // Get config and fs from RNFetchBlob
  //   // config: To pass the downloading related options
  //   // fs: Directory path where we want our image to download
  //   const { config, fs } = RNFetchBlob
  // let DownloadDir = fs.dirs.DownloadDir     // this is the Downloads directory.
  // let options = {
  //   fileCache: true,
  //   autorename : false,
  //   //  appendExt : extension, //Adds Extension only during the download, optional
  //    addAndroidDownloads : {
  //     useDownloadManager : true,      //uses the device's native download manager.
  //     notification : true,
  //     mediaScannable : true,
  //     // autorename : false,
  //     //  mime: 'text/plain',
  //     title : "Invoice_"+data.client,    // Title of download notification.
  //     //path:  DownloadDir+'_'+invoiceData.client+'.pdf', // this is the path where your download file will be in
  //     path:  DownloadDir+'_'+data.client+'.'+ext,
  //     description : 'Downloading file.'
  //   }
  // }
  // config(options)
  // .fetch('GET',URL+"/payment/generate_invoice_pdf/"+OID+"/?download=true")
  // .then((res) => {
  //   //console.log("Success");
  //   })
  // .catch((err) => {console.log('error')})    // To execute when download  cancelled and other errors
  // }

  // const getExtention = filename => {
  // // To get the file extension
  // return /[.]/.exec(filename) ?
  //          /[^.]+$/.exec(filename) : filename;
  // };

  // const getExtention = filename => {
  //   // To get the file extension
  //   return /[.]/.exec('.pdf') ?
  //            /[^.]+$/.exec('.pdf') : 'pdf';
  // };

  const Delivery_Note_Download = () => {
    fetch(URL + "/payment/add_delivery_note/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: id,
        delivery_note_number: DN,
        delivery_note: deliveryNote,
        purchased_products: cartItems,
      }),
    })
      .then(async (response) => {
        let data = await response.json();
        console.log("put", data);
        console.log("put", response.status);

        Linking.openURL(
          URL + "/payment/generate_delivery_note_pdf/" + id + "/?download=true"
        );

      })
      .catch((error) => console.log("Something went wrong", error));
  };

  const invoice = () => {
    console.log("orderId", id);
    console.log("Box Id", d_orderBoxId);
    console.log("Cart Items", cartItems);

    dispatch(OrderBox.clear());

    navigation.navigate("Invoice", {
      orderBoxId: d_orderBoxId,
      OID: id,
      image: ClientImage,
    });

    fetch(URL + "/payment/add_delivery_note/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: id,
        delivery_note_number: DN,
        delivery_note: deliveryNote,
        purchased_products: cartItems,
      }),
    })
      .then(async (response) => {
        let data = await response.json();
        console.log("put", data);
        console.log("put", response.status);
        if (response.status == 200) {
          alert("Invoice created successfully.");
          dispatch(DeliveryNoteAction.AllClear(1));
          console.log("Its work");
          setDeliveryNote("");
          //  checkPermission();
          // checkPermission();
          changeStatus();
          //   setCount(0);
          //  navigation.navigate("Dashboard")
        } else {
          changeStatus();
        }

        //send_Verification_Code()
        // navigation.navigate("VerificationCode" , {Email : email , Phone_No : phoneNumber})
      })
      .catch((error) => console.log("Something went wrong", error));
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (route.name === "DeliveryNote") {
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [route])
  );

  useEffect(() => {
    // getToken();

    // dispatch(DeliveryNoteAction.add(dataDetails));

    //   console.log("hi---------------")
    // console.log(PoNumber,"-----");
    // console.log(OrderId,"------")
    setIsLoading(true);
    console.log("iddddddd", id);
    if (d_orderBoxId != "") {
      fetch(URL + "/payment/get_delivery_note_number/" + d_orderBoxId)
        // fetch(URL+'/client_app/clients_list/33/')
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("DN No:", responseJson.dn_number);
          dispatch(DeliveryNoteAction.setTotalQuantity(dataDetails));
          console.log(responseJson, "---------------------hey");
          setDN(responseJson.dn_number);
          setIsLoading(false);
          //   setDeliveryNote(responseJson.order.delivery_notes);
          //   setBoxData(responseJson.order);
          //   setBoxDetail(responseJson.order.order_products)
          //   setIsLoading(false)
          //   setDataStatus(responseJson.order.status)
          //   console.log(boxDetail,"-------")
          //   setIsLoading(false)
          //   console.log("Dashboard:",responseJson.client_dashboard.client_name);
          //console.log("Buisness Detail:",responseJson.client_businesses[0]['name']);
          // if (json["response"] == "Record does not exist or not found") {
          //   setLoading(true);
          // } else {
          //   dispatch(ApiDataAction.SetListData(responseJson));
          //   dataa=responseJson;
          //   setData(responseJson);
          //   //console.log(json);

          // }
        })
        .catch((error) => console.error(error));
    }

    //   setDisvisible(false)
    // .finally(() => setIsLoading(false));

    //console.log(data)
  }, [OrderBoxId, disvisible]);
  // console.log("Order Box Id:",OrderBoxId);
  // console.log("Order Box Id:",boxDetail);
  return (
    <View style={{ flex: 1 }}>
      {/* <MyHeader name="DELIVERY NOTE" nav={navigation}/> */}
      <ScrollView>
        {isLoading ? (
          <Spinner color={Colors.themeColor} />
        ) : (
          <Content>
            {/* <View style={{backgroundColor:"#E2E2E2"}}> */}
            <View style={styles.footer}>
              <View
                style={{
                  marginTop: 5,
                  elevation: 0,
                  shadowRadius: 0,
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    flexDirection: "row",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {DN}
                </Text>
                {/* <Text style={{alignSelf:'center',flexDirection:'row',fontSize:16,fontWeight:'bold'}}>{data.purchase_order_no}</Text> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  padding: 15,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              >
                <Card
                  style={{
                    padding: 10,
                    width: "50%",
                    backgroundColor: "#e6e6e6",
                    elevation: 0,
                    borderRadius: 7,
                  }}
                >
                  {/* <View style={{flexDirection:'row'}}> */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        marginLeft: Platform.OS == "android" ? 0 : 0,
                        width: "35%",
                      }}
                    >
                      <Image
                        source={
                          RiderImage == null || RiderImage == ""
                            ? require("../assets/profilelogo.png")
                            : { uri: RiderImage }
                        }
                        style={{
                          width: Platform.OS == "ios" ? 50 : 50,
                          height: Platform.OS == "ios" ? 50 : 50,
                          borderRadius: 60,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        paddingLeft: Platform.OS == "android" ? 5 : 0,
                        width: "65%",
                      }}
                    >
                      <Text style={{ color: Colors.themeColor, fontSize: 12 }}>
                        Delivery Person:
                      </Text>

                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        {data.delivery_person_name}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#666666" }}>
                        {RiderAddress}
                      </Text>
                    </View>
                  </View>
                </Card>

                <Card
                  style={{
                    padding: 10,
                    marginLeft: 10,
                    width: "50%",
                    backgroundColor: "#e6e6e6",
                    elevation: 0,
                    borderRadius: 7,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        marginLeft: Platform.OS == "android" ? 0 : 0,
                        width: "35%",
                        //borderWidth: 2
                      }}
                    >
                      <Image
                        source={
                          ClientImage == null || ClientImage == ""
                            ? require("../assets/profilelogo.png")
                            : { uri: ClientImage }
                        }
                        style={{
                          width: Platform.OS == "ios" ? 50 : 50,
                          height: Platform.OS == "ios" ? 50 : 50,
                          borderRadius: 60,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        paddingLeft: Platform.OS == "android" ? 5 : 0,
                        width: "65%",
                      }}
                    >
                      <Text style={{ color: Colors.themeColor, fontSize: 12 }}>
                        Customer:
                      </Text>

                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        {data.client}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#666666" }}>
                        {data.business_address}
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>


              <View
                style={{
                  elevation: 0,
                  shadowRadius: 0,
                  backgroundColor: "white",
                }}
              >
                {/* <Text style={{alignSelf:'center',flexDirection:'row',fontSize:16,fontWeight:'bold'}}>{DN}</Text> */}
                <Text
                  style={{
                    alignSelf: "center",
                    flexDirection: "row",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {data.purchase_order_no}
                </Text>
              </View>

            </View>

            {/* <View style={{backgroundColor:"#E2E2E2"}}> */}
            <View

              style={{ flexDirection: "row", marginTop: 20,  width: "95%",  alignSelf: "center", }}
            >
              <Text
                style={{
                  color: Colors.themeColor,
                  width: "35%",
                  fontSize: 17,
                  fontWeight: "bold",
                  textAlign: "left",
                  // borderColor: "black",
                  //borderWidth: 1,
                }}
              >
                Product
              </Text>
              <Text
                style={{
                  color: Colors.themeColor,
                  width: "35%",
                  fontSize: 17,
                  fontWeight: "bold",
                  textAlign: "center",
                  //marginLeft: 5,
                  // borderColor: "black",
                   //borderWidth: 1,
                }}
              >
                Unit
              </Text>
              <Text
                style={{
                  color: Colors.themeColor,
                  width: "30%",
                  fontSize: 17,
                  fontWeight: "bold",
                  textAlign: "center",
                  //marginLeft: 20,
                  // borderColor: "black",
                   //borderWidth: 1,
                }}
              >
                {" "}
                Quantity
              </Text>
              {/* <Text style={{color:Colors.themeColor,fontSize:17,fontWeight:'bold',marginRight:20}}>Price</Text> */}
            </View>
            {/* <View style={{borderBottomColor:Colors.textGreyColor,borderBottomWidth:2,}}> */}
            {/* <View style={{borderBottomColor:Colors.textGreyColor,borderBottomWidth:2,marginBottom:10}}> */}
            <FlatList
              data={dataDetails}
              keyExtractor={(item) => item.product_id}
              renderItem={(itemData) => (
                <DeliveryCart
                  id={itemData.item.product_id}
                  quantity={itemData.item.quantity}
                  total_amount={itemData.item.total_amount}
                  name={itemData.item.product_name}
                  unit={itemData.item.product_unit} //fv
                  price={itemData.item.avg_price}
                  totalQty={SubQuantity}
                  responseData={dataDetails}
                />
              )}
            />
            <View
              style={{
                flexDirection: "row",
                width: "95%",
                // borderBottomWidth: 0.5,
                // borderBottomColor: "grey",
                marginTop: 10,
                //borderWidth: 1,
                alignSelf: "center",
                justifyContent:'space-between'
              }}
            >
              <Text
                style={{
                  color: Colors.themeColor,
                  width: "40%",
                  textAlign: "left",
                  // marginLeft: "2%",
                  fontWeight: "bold",
                  //marginLeft: 10,
                   //borderWidth: 1

                }}
              >
                Total Packages
              </Text>


              {newTotalQty == "" ? (
                <Text
                  style={{
                    color: Colors.themeColor,
                    width: "34%",
                    textAlign: 'center',
                    // paddingLeft: "15%",
                    fontWeight: "bold",
                     //borderWidth: 1,

                  }}
                >
                  {SubQuantity}
                </Text>
              ) : (
                
                <Text
                  style={{
                    color: Colors.themeColor,
                    width: "32%",
                    textAlign: 'center',
                    // paddingLeft: "15%",
                    fontWeight: "bold",
                    //borderWidth: 1,

                  }}
                >
                  {newTotalQty}
                </Text>
              )}
            </View>
            {/* <View style={{flexDirection:'row'}}>

  {/* <Card style={{width:"90%",alignSelf:'center',backgroundColor:"#E2E2E2",elevation:0,marginTop:20,padding:10}}> */}
            <View style={{ padding: 10 , }}>
              <TextInput
                style={styles.note_inputArea}
                placeholder="Write any Note"
                autoCapitalize="words"
                placeholderTextColor={Colors.productGrey}
                value={deliveryNote}
                required={true}
                onChangeText={(value) => setDeliveryNote(value)}
                initialValue=""
              />
            </View>
            {/* </Card> */}

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignSelf: "center",
                padding: 10,
                paddingTop: 0,
                justifyContent: "center",
              }}
            >





              <View
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                  borderColor: Colors.textGreyColor,
                  borderWidth: 5,
                  marginTop: "3%",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.themeColor,
                    marginTop: "12%",
                    fontWeight: "bold",
                    fontSize: 12,
                    margin:'2%',

                  }}
                >

                Delivery

                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.themeColor,
                    //marginTop: "20%",
                    fontWeight: "bold",
                    fontSize: 12,
                    margin:'2%',

                  }}
                >
                Date & Time

                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    color: Colors.themeColor,
                    //marginTop: "35%",
                    //fontWeight: "bold",
                    fontSize: Platform.OS == "android" ? 12 : 11,
                  }}
                >

                  {data.order_delivery_datetime}
                </Text>
              </View>






              <View style={{ alignSelf: "center", marginLeft: "5%" }}>
                {/* <View style={{backgroundColor:Colors.themeColor,height:17, borderRadius:4,width:"40%"}}>
<Text style={{color:"white",fontSize:12,fontWeight:'bold',textAlign:'center',}}>{data.status.toUpperCase()}</Text>
</View> */}
                <Text style={{ color: Colors.productGrey, fontSize: 14 }}>
                  Delivery Address:{" "}
                </Text>
                <Text style={{ fontSize: 16, width: 210 }}>
                  {data.business_address}
                </Text>
              </View>
            </View>

            <View style={{ alignSelf: "center", marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>PREVIEW</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={Delivery_Note_Download}
                // onPress = {()=>{
                // Linking.openURL(URL+"/payment/generate_delivery_note_pdf/"+id+"/?download=true")
                // // alert(id)

                // }}

                style={styles.button}
              >
                <Text style={styles.buttonText}>PRINT DELIVERY NOTE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={invoice} style={styles.button}>
                <Text style={styles.buttonText}>CREATE INVOICE</Text>
              </TouchableOpacity>
            </View>

            {/* //--------------------------New Modal Preview----------------------------------------- */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                //   Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView2}>
                <View style={styles.modalView2}>
                  <View
                    style={{
                      width: "95%",
                      height: Platform.OS == "android" ? "95%" : "90%",
                      backgroundColor: "white",
                      alignSelf: "center",
                      borderRadius: 10,
                      flexDirection: "row",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      // shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 0,
                    }}
                  >
                    {/* <Card style={{borderRadius:10,width:"90%",height:"90%",alignItems:'center',backgroundColor:"white"}}> */}
                    <ScrollView
                      keyboardShouldPersistTaps="always"
                      showsVerticalScrollIndicator={false}
                      style={{ padding: 10 }}
                    >
                      <View
                        style={{
                          alignSelf: "center",
                          padding: "3%",
                          paddingBottom: "2%",
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.themeColor,
                            fontSize: 24,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          PREVIEW
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          padding: 5,
                          alignSelf: "center",
                        }}
                      >
                        <View
                          style={{
                            width: "50%",
                            backgroundColor: "#e6e6e6",
                            alignSelf: "center",
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            // shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 0,
                            padding: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignSelf: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <View
                              style={{
                                marginLeft: Platform.OS == "android" ? 0 : 0,
                                width: "35%",
                              }}
                            >
                              <Image
                                source={
                                  RiderImage == null || RiderImage == ""
                                    ? require("../assets/profilelogo.png")
                                    : { uri: RiderImage }
                                }
                                style={{
                                  width: Platform.OS == "ios" ? 50 : 50,
                                  height: Platform.OS == "ios" ? 50 : 50,
                                  borderRadius: 60,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                paddingLeft: Platform.OS == "android" ? 5 : 0,
                                width: "65%",
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.themeColor,
                                  fontSize: 12,
                                }}
                              >
                                Delivery Person:
                              </Text>

                              <Text
                                style={{ fontSize: 14, fontWeight: "bold" }}
                              >
                                {data.delivery_person_name}
                              </Text>
                              <Text style={{ fontSize: 12, color: "#666666" }}>
                                {RiderAddress}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            width: "50%",
                            backgroundColor: "#e6e6e6",
                            alignSelf: "center",
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            // shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 0,
                            padding: 10,
                            marginLeft: 5,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignSelf: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <View
                              style={{
                                marginLeft: Platform.OS == "android" ? 0 : 0,
                                width: "35%",
                              }}
                            >
                              <Image
                                source={
                                  ClientImage == null || ClientImage == ""
                                    ? require("../assets/profilelogo.png")
                                    : { uri: ClientImage }
                                }
                                style={{
                                  width: Platform.OS == "ios" ? 50 : 50,
                                  height: Platform.OS == "ios" ? 50 : 50,
                                  borderRadius: 60,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                paddingLeft: Platform.OS == "android" ? 5 : 0,
                                width: "65%",
                              }}
                            >
                              <Text
                                style={{
                                  color: Colors.themeColor,
                                  fontSize: 12,
                                }}
                              >
                                Customer:
                              </Text>

                              <Text
                                style={{ fontSize: 14, fontWeight: "bold" }}
                              >
                                {data.client}
                              </Text>
                              <Text style={{ fontSize: 12, color: "#666666" }}>
                                {data.business_address}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={{ flexDirection: "row", marginTop: 30,
                      //borderWidth: 1
                      }}>
                        <Text
                          style={{
                            color: Colors.themeColor,
                            width: "35%",
                            fontSize: 17,
                            fontWeight: "bold",
                            textAlign: "left",
                            //borderWidth: 1
                          }}
                        >
                          Product
                        </Text>
                        {/* <Text style={{color:Colors.themeColor,width:35,fontSize:17,fontWeight:'bold',textAlign:'center'}}>Unit</Text> */}
                        <Text
                          style={{
                            color: Colors.themeColor,
                            width: "30%",
                            fontSize: 17,
                            fontWeight: "bold",
                            textAlign: "center",
                            //borderWidth: 1
                          }}
                        >
                          Unit
                        </Text>
                        <Text
                          style={{
                            color: Colors.themeColor,
                            width: "35%",
                            fontSize: 17,
                            fontWeight: "bold",
                            textAlign: 'center',
                            //borderWidth: 1
                          }}
                        >
                          Quantity
                        </Text>

                        {/* <Text
                          style={{
                            color: Colors.themeColor,
                            width: "16%",
                            fontSize: 17,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          VAT
                        </Text> */}

                        {/* <Text
                          style={{
                            color: Colors.themeColor,
                            fontSize: 17,
                            fontWeight: "bold",
                            width: "20%",
                            textAlign: "right",
                          }}
                        >
                          Amount
                        </Text> */}
                      </View>

                      <View style={{ marginBottom: 10 }}>
                        <FlatList
                          data={dataDetails}
                          keyExtractor={(item) => item.product_id}
                          renderItem={(itemData) => (
                            <DeliveryNoteItem
                              id={itemData.item.product_id}
                              quantity={itemData.item.quantity}
                              total_amount={itemData.item.total_amount}
                              name={itemData.item.product_name}
                              unit={itemData.item.product_unit}
                              price={itemData.item.unit_sales_price}
                              // vat={itemData.item.vat_amount}
                              // amount={itemData.item.amount}
                            />
                          )}
                        />

                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          width: "100%",
                          // borderBottomWidth: 0.5,
                          // borderBottomColor: "grey",
                          marginTop: 10,
                          //borderWidth:1,
                          justifyContent: 'space-between'
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.themeColor,
                            width: "40%",
                            textAlign: "left",
                            // marginLeft: "2%",
                            fontWeight: "bold",
                            //marginLeft: 10,
                          //borderWidth: 1,

                          }}
                        >
                          Total Packages
                        </Text>
                        {newTotalQty == "" ? (
                          <Text
                      style={{
                        color: Colors.themeColor,
                        width: "35%",
                        textAlign: 'center',
                        // paddingLeft: "15%",
                        fontWeight: "bold",
                        //borderWidth: 1,
                        justifyContent: 'flex-end',

                        }}
                        >

                            {SubQuantity}
                          </Text>
                        ) : (
                          <Text
                            style={{
                        color: Colors.themeColor,
                        width: "35%",
                        textAlign: 'center',
                        // paddingLeft: "15%",
                        fontWeight: "bold",
                        //borderWidth: 1,
                        justifyContent: 'flex-end',

                        }}
                          >
                            {newTotalQty}
                          </Text>
                        )}
                      </View>





                      <View style={{ marginTop: "10%", alignSelf: "center" }}>
                        <Pressable
                          style={styles.signupButton1}
                          activeOpacity={0.7}
                          onPress={() => setModalVisible(!modalVisible)}
                        >
                          {loading ? (
                            <Spinner color={"white"} size={20} />
                          ) : (
                            <Text style={styles.signupButtonText1}>OK</Text>
                          )}
                        </Pressable>

                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>
            </Modal>

            {/* -------------------------------+++++++++++++++++++++------------------------------------------ */}

            {/* </View> */}
            {/* {dataStatus=="in progress"?null:
        <View style={{alignSelf:'center',marginTop:20}}>
              {dataStatus=='in progress'||dataStatus=="purchased"?null:<TouchableOpacity style={styles.button} disabled={dataStatus=="in progress"||dataStatus=="purchased"?true:false} onPress={accept}>
                <Text style={styles.buttonText}>ACCEPT</Text>
            </TouchableOpacity>}
            {dataStatus=='pending'?null:
            <TouchableOpacity onPress={purchase} style={styles.button}>
                <Text style={styles.buttonText}>Deliver Note</Text>
            </TouchableOpacity>}
              </View>} */}
            {/* <View style={{alignSelf:'center',marginTop:40}}>
            <TouchableOpacity onPress={setting} disabled={dataStatus=="purchased"?true:false} style={styles.button}>
            <Text style={styles.buttonText}>{dataStatus.toUpperCase()}</Text>
            </TouchableOpacity>
        </View> */}
            {/* </View> */}
          </Content>
        )}
        {/* </View> */}


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: '#EE0202',
  },
  activityIndicator: {
    // backgroundColor:'#FFF',
    // alignItems: 'center',
    // justifyContent: 'center',
    // alignSelf:"center",
    fontSize: 25,
    width: "60%",
    color: Colors.accentColor,
  },

  spinner: {
    //flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 30,
    //backgroundColor: '#ecf0f1',
    //padding: 8,
  },
  note_inputArea: {
    alignSelf: "center",
    marginVertical: 10,
    height: 60,
    width: "100%",
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    paddingHorizontal: 30,
  },

  signupContianer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  signupText: {
    fontSize: 14,
    fontWeight: "bold",
    // color:'rgba(255,255,255, 0.7)',
    color: "black",
  },
  signupButton: {
    fontWeight: "bold",
    backgroundColor: "#EE0202",
    fontSize: 20,
    width: 100,
    height: 30,
    borderRadius: 25,
  },
  header: {
    flex: 1,
    width: "100%",
    //backgroundColor:'#EE0202',
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    backgroundColor: "#ffffff",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    //paddingVertical: 10,
    // paddingHorizontal: 60,
  },
  g_container: {
    // flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputArea: {
    marginVertical: 15,
    height: 40,
    width: "100%",
    backgroundColor: "white",
    borderColor: Colors.textGreyColor,
    borderWidth: 2,

    borderRadius: 5,
    paddingHorizontal: 30,
  },
  button: {
    height: 40,
    width: 300,
    backgroundColor: Colors.themeColor,
    justifyContent: "center",
    borderRadius: 25,
    marginVertical: 5,
  },
  s_button: {
    height: 40,
    width: 300,
    backgroundColor: Colors.themeColor,
    justifyContent: "center",
    borderRadius: 25,
    //   marginVertical: 5,
  },

  buttonText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "800",
    textAlign: "center",
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 90,
    // justifyContent: 'center',
    //alignItems: 'center',
  },
  bu_signupButton1: {
    marginTop: 10,
    height: 30,
    width: 150,
    backgroundColor: "white",
    borderColor: Colors.themeColor,
    borderWidth: 2,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 25,
    // marginVertical: 20,
  },
  bu_signupButtonText1: {
    fontSize: 20,
    color: Colors.themeColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  signupButtonText1: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
    textAlign: "center",
  },
  signupButton1: {
    marginTop: 5,
    height: 30,
    width: 150,
    backgroundColor: Colors.themeColor,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 25,
    // marginVertical: 20,
  },
  centeredView2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 60,
  },
  modalView2: {
    margin: 20,
    // height:"100%",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    // borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DeliveryNote;
