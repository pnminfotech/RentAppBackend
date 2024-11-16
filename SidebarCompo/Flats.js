import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

const API_URL = "https://stock-management-system-server-tmxv.onrender.com";

const Flats = ({ route, navigation }) => {
  const { societyId } = route.params;
  const [flats, setFlats] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flatName, setFlatName] = useState("");
  const [flatType, setFlatType] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/flats/flats-by-wings/${societyId}`)
      .then((response) => response.json())
      .then((data) => setFlats(data))
      .catch((error) => console.error("Error fetching flats:", error));
  }, [societyId]);

  const toggleModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/flats/add-flats-by-wing/${societyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: flatName,
            flat_type: flatType,
            amount: amount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add flat");
      }

      const newFlat = await response.json();
      newFlat.society_id = societyId;

      setFlats([...flats, newFlat]);
      Alert.alert("Flat added successfully");
      setFlatName("");
      setFlatType("");
      setAmount("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding flat:", error);
      Alert.alert("Failed to add flat");
    }
  };

  const handleFlatPress = (flat) => {
    navigation.navigate("Userdetails", { flatId: flat._id });
  };

  const renderFlats = () => {
    return (
      <View style={styles.buildingsContainer}>
        {flats.map((flat) => (
          <TouchableOpacity
            key={flat._id}
            style={styles.buildingItem}
            onPress={() => handleFlatPress(flat)}
          >
            <Image
              source={require("../assets/images/flats.jpg")}
              style={styles.buildingImage}
            />
            <Text style={styles.buildingName}>{flat.name}</Text>
            <Text style={styles.buildingName}>{flat.amount}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Total Flats</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {renderFlats()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Flat</Text>
            <TextInput
              style={styles.input}
              placeholder="Name of Flat"
              value={flatName}
              onChangeText={(text) => setFlatName(text)}
              editable={true}
            />
            <RNPickerSelect
              onValueChange={(value) => setFlatType(value)}
              items={[
                { label: "1R", value: "1R" },
                { label: "1RK", value: "1RK" },
                { label: "1BHK", value: "1BHK" },
                { label: "2BHK", value: "2BHK" },
                { label: "3BHK", value: "3BHK" },
              ]}
              style={pickerSelectStyles}
              value={flatType}
              placeholder={{ label: "Select Flat Type", value: null }}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              value={amount}
              onChangeText={(text) => setAmount(text)}
              editable={true}
              keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>ADD</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.addButtonText}>Add Flat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Flats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 20,
  },
  buildingsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buildingItem: {
    width: "48%",
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  buildingImage: {
    width: "90%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  buildingName: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#FFBF00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
    minHeight: 40,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    width: "100%",
    // marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    width: "100%",
    // marginBottom: 20,
  },
});
