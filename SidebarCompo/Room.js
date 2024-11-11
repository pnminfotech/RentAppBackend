import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Room = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenantsByFlat, setTenantsByFlat] = useState({});
  const [selectedFlatId, setSelectedFlatId] = useState(null); // State to track the selected flat

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await fetch(
          "https://stock-management-system-server-6mja.onrender.com/api/flats"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFlats(data);
        fetchTenantsForAllFlats(data); // Fetch tenants for all flats
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flats:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFlats();
  }, []);

  // Fetch tenants for all flats
  const fetchTenantsForAllFlats = (flats) => {
    const fetchTenants = async (flat_id) => {
      try {
        const response = await fetch(
          `https://stock-management-system-server-6mja.onrender.com/api/tenants/tenants-by-flat/${flat_id}`
        );
        const data = await response.json();
        setTenantsByFlat((prev) => ({
          ...prev,
          [flat_id]: data,
        }));
      } catch (error) {
        console.error("Error fetching tenants for flat:", flat_id, error);
      }
    };

    // Loop through all flats and fetch tenants for each
    flats.forEach((flat) => {
      fetchTenants(flat._id);
    });
  };

  const renderItem = ({ item }) => {
    const tenants = tenantsByFlat[item._id]; // Get tenants for the current flat
    const isAllotted = tenants && tenants.length > 0; // Check if the flat has tenants
    const isSelected = item._id === selectedFlatId; // Check if the flat is selected

    return (
      <View>
        <TouchableOpacity onPress={() => setSelectedFlatId(isSelected ? null : item._id)}>
          <View style={styles.flatItem}>
            <Image
              source={require("../assets/images/flats.jpg")}
              style={styles.image}
            />
            <View style={styles.flatDetails}>
              <Text style={styles.flatName}>
                {item.name} - <Text style={styles.statusText}>{isAllotted ? "Allotted" : "Vacant"}</Text>
              </Text>

              {/* Show tenants if the flat is selected */}
              {isSelected && tenants && tenants.length > 0 && (
                <View style={styles.tenantsContainer}>
                  {tenants.map((tenant) => (
                    <Text key={tenant._id} style={styles.tenantText}>
                      {tenant.name}
                    </Text>
                  ))}
                </View>
              )}

              {/* Show message if no tenants for the selected flat */}
              {isSelected && (!tenants || tenants.length === 0) && (
                <Text style={styles.noTenantsText}>No tenants available</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error fetching data: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={flats}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  flatItem: {
    flexDirection: "row",
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  flatDetails: {
    justifyContent: "center",
    width: "75%",
  },
  flatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusText: {
    fontWeight: "bold",
    color: "green",
  },
  tenantsContainer: {
    marginTop: 5,
    paddingBottom: 10,
  },
  tenantText: {
    fontSize: 16,
    color: "#333",
  },
  noTenantsText: {
    fontSize: 16,
    color: "red",
  },
});

export default Room;
