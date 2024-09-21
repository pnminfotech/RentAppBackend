import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";

const API_URL = "https://stock-management-system-server-6mja.onrender.com";

export default function Userdetails({ route }) {
  const { flatId } = route.params;
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [aadharBackPhotoUri, setAadharBackPhotoUri] = useState("");
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [date, setDate] = useState(new Date()); // Initialize date state
  const [show, setShow] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [calculatedValue, setCalculatedValue] = useState("");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch(
        `https://stock-management-system-server-6mja.onrender.com/api/tenants/tenants-by-flat/${flatId}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setTenants(data);
        setFilteredTenants(data);
      } else {
        console.error("Fetched data is not an array:", data);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error("Error fetching tenants:", error);
    }
  };

  const [errors, setErrors] = useState({
    ph_no: "",
    emailId: "",
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false); // Keep the picker open on iOS if desired
    setDate(currentDate);
  
    // Update userDetails state with selected date
    setUserDetails((prevState) => ({
      ...prevState,
      rent_form_date: currentDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
    }));
  };
  

  const showMode = () => {
    setShow(true);
  };

  const [userDetails, setUserDetails] = useState({
    name: "",
    ph_no: "",
    emailId: "",
    age: "",
    gender: "",
    maintaince: "",
    final_rent: "",
    deposit: "",
    current_meter_reading: "",
    rent_form_date: "",
    permanant_address: "",
    previous_address: "",
    nature_of_work: "",
    working_address: "",
    work_ph_no: "",
    family_members: "",
    male_members: "",
    female_members: "",
    childs: "",
    family_member_names: "",
    reference_person1: "",
    reference_person2: "",
    reference_person1_age: "",
    reference_person2_age: "",
    agent_name: "",
    flat_id: "",
    rent_status: "paid",
    active: "true",
    rentPaid: "false", // Assuming a default value
  });

  const [files, setFiles] = useState({
    tenant_photo: null,
    adhar_front: null,
    adhar_back: null,
    pan_photo: null,
    electricity_bill: null,
  });

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = async () => {
    setUserDetails({
      name: "",
      tenantPhotoUri: null,
      adharFrontUri: null,
      adharBackUri: null,
      panPhotoUri: null,
      electricityBillUri: null,
      ph_no: "",
      emailId: "",
      age: "",
      gender: "",
      maintaince: "",
      final_rent: "",
      deposit: "",
      current_meter_reading: "",
      rent_form_date: "",
      permanant_address: "",
      previous_address: "",
      nature_of_work: "",
      working_address: "",
      work_ph_no: "",
      family_members: "",
      male_members: "",
      female_members: "",
      childs: "",
      family_member_names: "",
      reference_person1: "",
      reference_person2: "",
      reference_person1_age: "",
      reference_person2_age: "",
      agent_name: "",
      flat_id: "",
      rent_status: "paid",
      active: "true",
      rentPaid: "false", // Reset all fields on modal open
    });
    setAddUserModalVisible(true);
  };

  const [dropdownOption, setDropdownOption] = useState("unit");
  const [inputAmount, setInputAmount] = useState("");
  // const [userDetails, setUserDetails] = useState({

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleDropdownChange = (value) => {
    setDropdownOption(value);
    updateCalculatedValue(inputAmount, value);
  };

  const updateCalculatedValue = (amount, option) => {
    let value = "";
    if (option === "unit") {
      value = (parseFloat(amount) * 12).toFixed(2);
    } else if (option === "bill") {
      value = amount;
    }
    setCalculatedValue(value);

    setUserDetails((prevState) => ({
      ...prevState,
      current_meter_reading: value,
    }));
  };

  const handleInputAmountChange = (text) => {
    setInputAmount(text);
    updateCalculatedValue(text, dropdownOption);
  };
  const FormData = require("form-data");

  const handleInputChange = (key, value) => {
    setUserDetails((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleAction = (tenant, action) => {
    setSelectedTenant(tenant);
    if (action === "paid") {
      setModalMessage(`Did ${tenant.name} pay rent?`);
    } else {
      setModalMessage(`Do you want to deactivate ${tenant.name}?`);
    }
    setConfirmAction(action);
    setModalVisible(true);
  };

  const handleConfirmAction = async (confirm) => {
    if (confirm) {
      if (confirmAction === "paid") {
        // Mark tenant rent as paid
        try {
          await axios.patch(
            `https://stock-management-system-server-6mja.onrender.com/api/tenants/update-rent-status/${selectedTenant._id}`,
            { rent_status: "Paid" }
          );
          setTenants(
            tenants.map((tenant) =>
              tenant._id === selectedTenant._id
                ? { ...tenant, rent_status: "Paid" }
                : tenant
            )
          );
        } catch (error) {
          console.error("Error updating rent status:", error);
        }
      } else if (confirmAction === "deactivate") {
        // Deactivate tenant
        try {
          await axios.patch(
            `https://stock-management-system-server-6mja.onrender.com/api/tenants/update-rent-status/${selectedTenant._id}`,
            { rent_status: "Deactive" }
          );
          setTenants(
            tenants.map((tenant) =>
              tenant._id === selectedTenant._id
                ? { ...tenant, rent_status: "Deactive" }
                : tenant
            )
          );
        } catch (error) {
          console.error("Error deactivating tenant:", error);
        }
      }
    }
    setModalVisible(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = tenants.filter((tenant) =>
        tenant.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTenants(filtered);
    } else {
      setFilteredTenants(tenants);
    }
  };
  const handleUploadPhotos = async () => {
    try {
      const formData = new FormData();
      const userFields = [
        "name",
        "rent_status",
        "ph_no",
        "emailId",
        "age",
        "gender",
        "maintaince",
        "final_rent",
        "deposit",
        "current_meter_reading",
        "rent_form_date",
        "permanant_address",
        "previous_address",
        "nature_of_work",
        "working_address",
        "work_ph_no",
        "family_members",
        "male_members",
        "female_members",
        "childs",
        "family_member_names",
        "reference_person1",
        "reference_person2",
        "reference_person1_age",
        "reference_person2_age",
        "agent_name",
      ];

      userFields.forEach((field) => {
        const value = userDetails[field];
        formData.append(field, value);
      });

      const appendFileToFormData = (fileUri, fieldName) => {
        if (!fileUri) {
          console.warn(`No file provided for ${fieldName}`);
          return;
        }

        const fileName = fileUri.split("/").pop();
        const fileExtension = fileName.split(".").pop().toLowerCase();
        let fileType = "";

        if (fileExtension === "png") fileType = "image/png";
        else if (fileExtension === "jpg" || fileExtension === "jpeg")
          fileType = "image/jpeg";
        else if (fileExtension === "pdf") fileType = "application/pdf";
        else {
          console.warn(
            `Unsupported file type for ${fieldName}: ${fileExtension}`
          );
          return;
        }

        formData.append(fieldName, {
          uri: fileUri,
          type: fileType,
          name: fileName,
        });
      };

      const {
        tenantPhotoUri,
        adharFrontUri,
        adharBackUri,
        panPhotoUri,
        electricityBillUri,
      } = userDetails;

      appendFileToFormData(tenantPhotoUri, "tenant_photo");
      appendFileToFormData(adharFrontUri, "adhar_front");
      appendFileToFormData(adharBackUri, "adhar_back");
      appendFileToFormData(panPhotoUri, "pan_photo");
      appendFileToFormData(electricityBillUri, "electricity_bill");
      const response = await fetch(
        `https://stock-management-system-server-6mja.onrender.com/api/tenants/add-tenant-by-flat/${flatId}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        console.log("Upload successful:", responseData);
        alert(responseData.message);

        fetchTenants();
        setAddUserModalVisible(false);
      } else {
        console.error(
          "Upload failed with status:",
          response.status,
          responseData.message
        );
        throw new Error(responseData.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error during upload:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handlePhoneNumberChange = (text) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(text)) {
      setErrors((prevState) => ({
        ...prevState,
        ph_no: "Invalid phone number",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        ph_no: "",
      }));
    }

    setUserDetails((prevState) => ({
      ...prevState,
      ph_no: text,
    }));
  };

  const handleEmailChange = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setErrors((prevState) => ({
        ...prevState,
        emailId: "Invalid email address",
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        emailId: "",
      }));
    }

    setUserDetails((prevState) => ({
      ...prevState,
      emailId: text,
    }));
  };

  const filteredUserList = userList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChoosePhoto = async (photoType) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      const uri = pickerResult.assets[0].uri;
      setUserDetails((prevState) => ({
        ...prevState,
        [`${photoType}Uri`]: uri,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Tenant Details</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tenant..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Start Date</Text>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {filteredTenants.map((tenant) => (
          <TouchableOpacity
            key={tenant._id}
            style={styles.tableRow}
            onPress={() =>
              handleAction(
                tenant,
                tenant.status === "pending" ? "paid" : "deactivate"
              )
            }
          >
            <Text style={styles.tableCell}>
              {new Date(tenant.rent_form_date).toLocaleDateString()}
            </Text>
            <Text style={styles.tableCell}>{tenant.name}</Text>
            <Text
              style={[
                styles.tableCell,
                tenant.rent_status === "Active" && styles.activeStatus,
                tenant.rent_status === "Deactive" && styles.inactiveStatus,
              ]}
            >
              {tenant.rent_status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && selectedUser !== null}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tenant Details</Text>
            {selectedUser && (
              <View style={styles.userDetailContainer}>
                <View style={styles.userDetailRow}>
                  <Text style={styles.boldText}>Name:</Text>
                  <Text style={styles.userDetailText}>{selectedUser.name}</Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.boldText}>Start Date:</Text>
                  <Text style={styles.userDetailText}>{selectedUser.date}</Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.boldText}>Status:</Text>
                  <Text
                    style={[
                      styles.userDetailText,
                      selectedUser.status === "Active" && styles.activeStatus,
                      selectedUser.status === "Deactive" &&
                        styles.inactiveStatus,
                    ]}
                  >
                    {selectedUser.status}
                  </Text>
                </View>
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={{ alignItems: "center" }}
                >
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => (
                      <View key={tenant._id} style={styles.tableRow}>
                        <Text style={styles.tableCell}>
                          {new Date(tenant.rent_form_date).toLocaleDateString()}
                        </Text>
                        <Text style={styles.tableCell}>{tenant.name}</Text>
                        <Text
                          style={[
                            styles.tableCell,
                            tenant.rent_status === "Active"
                              ? styles.activeStatus
                              : styles.inactiveStatus,
                          ]}
                        >
                          {tenant.rent_status}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleAction(
                              tenant,
                              tenant.rent_status === "Active"
                                ? "pad"
                                : "deactivate"
                            )
                          }
                        >
                          <Text style={styles.actionButton}>
                            {tenant.rent_status === "Active"
                              ? "Mark as Paid"
                              : "Deactivate"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text>No tenants found</Text>
                  )}

                  {selectedTenant && (
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => setModalVisible(false)}
                    >
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                          {confirmAction === "paid"
                            ? "Mark rent as paid?"
                            : "Deactivate tenant?"}
                        </Text>
                        <View style={styles.modalButtons}>
                          <Button
                            title={
                              confirmAction === "paid" ? "Yes" : "Deactivate"
                            }
                            onPress={() => handleConfirmAction(true)}
                          />
                          <Button
                            title="No"
                            onPress={() => handleConfirmAction(false)}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                </ScrollView>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <Text style={styles.addButtonText}>Add Tenant</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addUserModalVisible}
        // onRequestClose={() => setAddUserModalVisible(false)}
      >
        <ScrollView
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Tenant</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.name}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    name: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.ph_no}
                onChangeText={handlePhoneNumberChange}
                keyboardType="numeric"
              />
              {errors.ph_no ? (
                <Text style={styles.errorText}>{errors.ph_no}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email ID:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.emailId}
                onChangeText={handleEmailChange}
              />
              {errors.emailId ? (
                <Text style={styles.errorText}>{errors.emailId}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.age}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    age: text,
                  }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender:</Text>
              <View style={styles.radioGroup}>
                <RadioButton.Group
                  onValueChange={(value) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      gender: value,
                    }))
                  }
                  value={userDetails.gender}
                >
                  <View style={styles.radioButtonContainer}>
                    <RadioButton value="male" />
                    <Text>Male</Text>
                  </View>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton value="female" />
                    <Text>Female</Text>
                  </View>
                </RadioButton.Group>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Maintaince:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.maintaince}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    maintaince: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Final Rent:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.final_rent}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    final_rent: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Deposit:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.deposit}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    deposit: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Choose Electricity Bill</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={dropdownOption}
                  style={styles.picker}
                  onValueChange={handleDropdownChange}
                >
                  <Picker.Item label="Current meter" value="unit" />
                  <Picker.Item label="Bill" value="bill" />
                </Picker>
              </View>
              {dropdownOption && (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={inputAmount}
                  onChangeText={handleInputAmountChange}
                />
              )}
              <Text style={styles.label}>Calculated Value:</Text>
              <TextInput
                style={styles.input}
                value={calculatedValue}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Button onPress={showMode} title="Select Rent Start Date" />
              {show && (
                <DateTimePicker
                  value={date} // Ensure date state is passed here
                  mode="date"
                  display="default" // Adjust based on platform or preference
                  onChange={onChange}
                />
              )}
            </View>
            <Text style={styles.dateSel}>Selected Date: {userDetails.rent_form_date}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Permanant Address:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.permanant_address}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    permanant_address: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Previous Address:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.previous_address}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    previous_address: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nature of Work:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.nature_of_work}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    nature_of_work: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Working Address:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.working_address}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    working_address: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Work Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.work_ph_no}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    work_ph_no: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Family Members:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.family_members}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    family_members: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Male Members:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.male_members}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    male_members: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Female Members:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.female_members}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    female_members: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Childs:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.childs}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    childs: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Family Member Names:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.family_member_names}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    family_member_names: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 1:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person1}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person1: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 2:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person2}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person2: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 1 Age:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person1_age}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person1_age: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 2 Age:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person2_age}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person2_age: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Agent Name:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.agent_name}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    agent_name: text,
                  }))
                }
              />
            </View>

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("tenantPhoto")}
            >
              <Text style={styles.buttonText}>Choose Tenant Photo</Text>
            </TouchableOpacity>

            {userDetails.tenantPhotoUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.tenantPhotoUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("adharFront")}
            >
              <Text style={styles.buttonText}>Choose Adhar Front Photo</Text>
            </TouchableOpacity>

            {userDetails.adharFrontUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.adharFrontUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("adharBack")}
            >
              <Text style={styles.buttonText}>Choose Adhar Back Photo</Text>
            </TouchableOpacity>

            {userDetails.adharBackUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.adharBackUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("panPhoto")}
            >
              <Text style={styles.buttonText}>Choose PAN Photo</Text>
            </TouchableOpacity>

            {userDetails.panPhotoUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.panPhotoUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("electricityBill")}
            >
              <Text style={styles.buttonText}>Choose Electricity Bill</Text>
            </TouchableOpacity>

            {userDetails.electricityBillUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.electricityBillUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleUploadPhotos} // Attach the handler to the button
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setAddUserModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  datePicker: {
    width: "100%",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  searchContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#333333",
  },
  scrollView: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    width: "100%",
  },
  tableCell: {
    flex: 1,
    color: "#333333",
  },
  activeStatus: {
    color: "green",
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  inactiveStatus: {
    color: "red",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  userDetailContainer: {
    width: "100%",
    marginBottom: 16,
  },
  userDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
    color: "#333333",
  },
  userDetailText: {
    color: "#333333",
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
    overflow: "hidden", // Ensures the border-radius is respected
  },
  addButton: {
    marginTop: 16,
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%", // Ensure button takes full width
    alignItems: "center", // Center text in button
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    width: "100%", // Ensure input takes full width
  },
  uploadButton: {
    marginTop: 8,
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%", // Ensure button takes full width
    alignItems: "center", // Center text in button
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center", // Center text in button
  },
  photoText: {
    marginTop: 8,
    color: "#333333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: "100%", // Adjust width as needed
    alignItems: "center", // Center text in button
  },
  buttonClose: {
    backgroundColor: "red", // Example color for close button
  },
  buttonSave: {
    backgroundColor: "green", // Example color for save button
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center", // Center text in buttons
  },
  picker: {
    height: 40,
    width: "100%",
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom:10,
  },
  datePickerButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerButtonText: {
    color: "#fff",
  },
  paidStatus: {
    color: "green",
  },
  pendingStatus: {
    color: "red",
  },dateSel:{
    marginBottom:10,
  }
});
