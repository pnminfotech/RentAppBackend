import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList 
} from "react-native";

const Report = ({ navigation }) => {


  const [societies, setSocieties] = useState([]);
  const [wingsBySociety, setWingsBySociety] = useState({});


  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedWing, setSelectedWing] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState(null);

  const [tenantsByFlat, setTenantsByFlat] = useState({});
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [flatName, setFlatName] = useState("");
  const [flatType, setFlatType] = useState("");
  const [amount, setAmount] = useState("");
  const [expandedSociety, setExpandedSociety] = useState(null);
  const [expandedWing, setExpandedWing] = useState(null);
  const [expandedFlat, setExpandedFlat] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loadingWings, setLoadingWings] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [expandedTenantFlat, setExpandedTenantFlat] = useState(null);
  const [expandedTenant, setExpandedTenant] = useState(null);

  const [loadingTenants, setLoadingTenants] = useState(false);
  const [loading, setLoading] = useState(false);


  const [flatsToShow, setFlatsToShow] = useState({}); // To manage which flats to sho    

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = () => {
    fetch(
      "https://stock-management-system-server-6mja.onrender.com/api/societies"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSocieties(data);
        setFetchError(null);
        fetchWingsForAllSocieties(data);
      })
      .catch((error) => {
        console.error("Error fetching societies:", error);
        setFetchError(error.message);
      });
  };

  const fetchWingsForAllSocieties = (societies) => {
    setLoadingWings(true);
    const fetchPromises = societies.map((society) =>
      fetch(
        `https://stock-management-system-server-6mja.onrender.com/api/wings/wings-by-society/${society._id}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((wings) => {
          const wingPromises = wings.map((wing) =>
            fetch(
              `https://stock-management-system-server-6mja.onrender.com/api/flats/flats-by-wings/${wing._id}`
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((flats) => {
                wing.flats = flats;
                return wing;
              })
          );
          return Promise.all(wingPromises).then((wingsWithFlats) => {
            return { societyId: society._id, wings: wingsWithFlats };
          });
        })
    );

    Promise.all(fetchPromises)
      .then((results) => {
        const wingsBySociety = {};
        results.forEach(({ societyId, wings }) => {
          wingsBySociety[societyId] = wings;
        });
        setWingsBySociety(wingsBySociety);
        setLoadingWings(false);
      })
      .catch((error) => {
        console.error("Error fetching wings:", error);
        setLoadingWings(false);
      });
  };


  const fetchTenantsForFlat = (flat_id) => {
    setLoadingTenants(true); // Start loading
    fetch(`https://stock-management-system-server-6mja.onrender.com/api/tenants/tenants-by-flat/${flat_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTenantsByFlat((prev) => ({
          ...prev,
          [flat_id]: data,
        }));
        setLoadingTenants(false); // End loading
      })
      .catch((error) => {
        console.error("Error fetching tenants:", error);
        setLoadingTenants(false); // End loading
      });
  };
 
  const renderTenants = (flat_id) => {
    if (loadingTenants) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
  
    return (
      <FlatList
        data={tenantsByFlat[flat_id] || []}
        keyExtractor={tenant => tenant._id}
        renderItem={({ item }) => (
          <View style={styles.tenantContainer}>
            <Image
              source={item.gender === "male" ? require("../assets/images/male.png") : require("../assets/images/female.png")}
              style={styles.tenantImage}
            />
            <View style={styles.tenantInfo}>
              <Text style={styles.tenantName}>{item.name}</Text>
            </View>
          </View>
        )}
      />
    );
  };


  const saveFlat = () => {
    if (!selectedWing || !flatName || !flatType || !amount) {
      console.error("Invalid wing ID or flat name");
      return;
    }

    fetch(
      "https://stock-management-system-server-6mja.onrender.com/api/flats",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: flatName,
          flat_type: flatType,
          wingId: selectedWing,
          amount: amount,
        }),
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorBody = await response.text();
          console.error("Failed to add flat:", errorBody);
          throw new Error("Failed to add flat");
        }
        return response.json();
      })
      .then((newFlat) => {
        // Ensure you update the state correctly
        setWingsBySociety((prev) => {
          const wingKey = Object.keys(prev).find((key) =>
            prev[key].some((wing) => wing._id === selectedWing)
          );

          if (!wingKey) {
            console.error("Wing not found");
            return prev; // No change if wing is not found
          }

          const updatedWings = prev[wingKey].map((wing) => {
            if (wing._id === selectedWing) {
              return {
                ...wing,
                flats: [...wing.flats, newFlat], // Add the new flat to the existing flats
              };
            }
            return wing;
          });

          return {
            ...prev,
            [wingKey]: updatedWings,
          };
        });

        setAddModalVisible(false);
        setFlatName("");
        setFlatType("");
        setAmount("");
      })
      .catch((error) => {
        console.error("Error adding flat:", error);
      });
  };

 
 
  const confirmDeleteFlat = () => {
    if (!selectedFlat || !selectedFlat.flat_id || !selectedFlat.wingId) {
      console.error("Invalid selected flat or wing ID");
      return;
    }

    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/flats/${selectedFlat.flat_id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete flat");
        return response.json();
      })
      .then(() => {
        setWingsBySociety((prev) => {
          const wingKey = Object.keys(prev).find((key) =>
            prev[key].some((wing) =>
              wing.flats.some((flat) => flat._id === selectedFlat.flat_id)
            )
          )

          if (!wingKey) {
            console.error("Wing not found");
            return prev; // No change if wing is not found
          }

          const updatedWings = prev[wingKey].map((wing) => {
            if (wing._id === selectedFlat.wingId) {
              return {
                ...wing,
                flats: wing.flats.filter((flat) => flat._id !== selectedFlat.flat_id),   
              };
            }
            return wing;
          });

          return {
            ...prev,
            [wingKey]: updatedWings,
          };
        });

        setDeleteModalVisible(false);

      })
      .catch((error) => {
        console.error("Error deleting flat:", error);
      });
  };


  const toggleSocietyExpansion = (societyId) => {
    setExpandedSociety((prev) => (prev === societyId ? null : societyId));
    setExpandedWing(null); // Reset expanded wing when toggling society
  };

  const toggleWingExpansion = (wingId) => {
    setExpandedWing((prev) => (prev === wingId ? null : wingId));
  };

  const toggleTenantExpansion = (tenantId) => {
    setExpandedTenant((prev) => (prev === tenantId ? null : tenantId));
  };
  const toggleFlatExpansion = (flatId) => {
    setExpandedFlat(expandedFlat === flatId ? null : flatId);
    if (expandedFlat !== flatId) {
      fetchTenantsForFlat(flatId);
    }
  };
  
  const handleFlatPress = (flat) => {
    setSelectedFlat(selectedFlat && selectedFlat.id === flat.id ? null : flat);
  };
  // const viewTenants = (flat_id) => {
  //   navigation.navigate("Userdetails", { flat_id });
  // };
  return (
    <View style={styles.container}>
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Flat</Text>
            <TextInput
              style={styles.input}
              value={flatName}
              onChangeText={setFlatName}
              placeholder="Enter Flat Name"
            />
            <TextInput
              style={styles.input}
              value={flatType}
              onChangeText={setFlatType}
              placeholder="Enter Flat Type"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={saveFlat}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.headerText}>Flat History</Text>

      {fetchError && (
        <Text style={styles.errorText}>Error fetching data: {fetchError}</Text>
      )}


<ScrollView contentContainerStyle={styles.scrollView}>
      {societies.map((society) => (
        <View key={society._id} style={styles.societyContainer}>
          <TouchableOpacity onPress={() => toggleSocietyExpansion(society._id)}>
            <View style={styles.societyHeader}>
              <Image
                source={require("../assets/images/building.png")}
                style={styles.buildingImage}
              />
              <Text style={styles.societyName}>{society.name}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          {expandedSociety === society._id && wingsBySociety[society._id] && (
            <View>
              {wingsBySociety[society._id].map((wing) => (
                <View key={wing._id} style={styles.wingflatcontainer}>
                  <TouchableOpacity onPress={() => toggleWingExpansion(wing._id)}>
                    <View style={styles.wingImageNameContainer}>
                      <View style={styles.wingContainer}>
                        <Image
                          source={require("../assets/images/wing.png")}
                          style={styles.wingImage}
                        />
                        <Text style={styles.wingName}>{wing.name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  {expandedWing === wing._id && (
                    <View style={styles.flatListingContainer}>
                      {wing.flats && wing.flats.length > 0 ? (
                        <FlatList
                          data={wing.flats}
                          keyExtractor={item => item._id}
                          renderItem={({ item }) => (
                            <View key={item._id} style={styles.flatContainer}>
                              <TouchableOpacity
                                onPress={() => {
                                  toggleFlatExpansion(item._id);
                                  fetchTenantsForFlat(item._id);
                                }}
                                style={styles.flatContent}
                              >
                                <Image
                                  source={require("../assets/images/flats.jpg")}
                                  style={styles.flatImage}
                                />
                                <View style={styles.flatDetails}>
                                  <Text style={styles.flatName}>{item.name} {item.flat_type}</Text>
                                </View>
                              </TouchableOpacity>
                              {expandedFlat === item._id && (
                                <View style={styles.tenantBox}>
                                  {renderTenants(item._id)}
                                </View>
                              )}
                            </View>
                          )}
                        />
                      ) : (
                        <Text>No flats available</Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
</View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5FCFF",
  },
  tenantBox: {
    marginTop: 20,
    marginRight:10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
  },
  viewMoreButton: {
    backgroundColor: '#f3b00c ', // Blue color
    padding: 9,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 2,
  },
  societyContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  wingflatcontainer: {
    flexDirection: "column",
  },
  flatListingContainer: {
    marginLeft: 20,
  },
  societyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  flatActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tenantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  buildingImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  societyName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 10,
  }, flatDetailsExpanded: {
    marginTop: 10,
  },
  wingContainer: {
    marginBottom: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  tenantImage: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
  },
  wingImageNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wingImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  wingName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addFlatButton: {
    marginTop: 10,
    backgroundColor: "#FFBF00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  addFlatButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  flatsContainer: {
    marginTop: 10,
  },
  flatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
   viewButton: {
    backgroundColor: "#007BFF",
    padding: 2,
    borderRadius: 5,
  },
  viewButtonText: {
    color: "#FFFFFF",
  },
   flatContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  flatName: {
    fontSize: 16,
    flex: 1,
  },
  flatIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 80,
  },
  noFlatsText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
   viewTenantsText: {
    marginRight: 30,
    color: '#007BFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#CCC",
  },
  saveButton: {
    backgroundColor: "#6699CC",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Report;