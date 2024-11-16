import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const Pendingstatus = () => {
  const [rentPendingTenants, setRentPendingTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentPendingTenants = async () => {
      try {
        const response = await fetch(
          "https://stock-management-system-server-6mja.onrender.com/api/tenants/rent-pending"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Log the response data to verify the structure

        // Check if data is an array or has a specific structure
        const tenantsWithPendingRent = Array.isArray(data)
          ? data.filter((tenant) => tenant.rent_status === "pending")
          : data.tenantRentPending.filter(
              (tenant) => tenant.rent_status === "pending"
            );

        setRentPendingTenants(tenantsWithPendingRent);
      } catch (error) {
        console.error("Error fetching rent pending tenants:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentPendingTenants();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.tenantItem}>
      <Image
        source={
          item.gender === "female"
            ? require("../assets/images/female.png")
            : require("../assets/images/male.png")
        }
        style={styles.image}
      />
      <View style={styles.tenantDetails}>
        <Text style={styles.tenantName}>{item.name}</Text>
        <Text>{item.final_rent}</Text>
        <Text style={styles.tenantName}>{item.ph_no}</Text>
        <Text style={styles.tenantRentStatus}>Rent Pending</Text>
      </View>
    </View>
  );

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Error fetching data: {error}</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <FlatList
        data={rentPendingTenants}
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
    backgroundColor: "#fff",
  },
  tenantItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  tenantDetails: {
    flex: 1,
  },
  tenantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tenantRentStatus: {
    fontSize: 14,
    color: "red",
  },
});

export default Pendingstatus;
