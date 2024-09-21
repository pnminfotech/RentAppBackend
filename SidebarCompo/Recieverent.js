import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Recieverent = () => {
  const [rentPaidTenants, setRentPaidTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentPaidTenants = async () => {
      try {
        const response = await fetch(
          "https://stock-management-system-server-6mja.onrender.com/api/tenants/rent-received"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const updatedTenants = await Promise.all(
          data.map(async (tenant) => {
            const currentDate = moment();
            const rentFromDate = moment(tenant.rent_form_date);
            const daysDiff = currentDate.diff(rentFromDate, "days");

            if (daysDiff > 30) {
              tenant.rent_status = "pending";
              await updateTenantStatus(tenant);
            } else {
              tenant.rent_status = "paid";
            }
            return tenant;
          })
        );

        setRentPaidTenants(updatedTenants);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentPaidTenants();
  }, []);

  const updateTenantStatus = async (tenant) => {
    try {
      const response = await fetch(
        `https://stock-management-system-server-6mja.onrender.com/api/tenants/${tenant._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rent_status: tenant.rent_status }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update tenant rent status");
      }
    } catch (error) {
      console.error("Error updating rent status:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderTenantItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={
          item.gender === "female"
            ? require("../assets/images/female.png")
            : require("../assets/images/male.png")
        }
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.emailId}</Text>
        <Text>Phone: {item.ph_no}</Text>
        <Text>Status: {item.rent_status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rentPaidTenants}
        keyExtractor={(item) => item._id}
        renderItem={renderTenantItem}
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
  item: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
  },
});

export default Recieverent;
