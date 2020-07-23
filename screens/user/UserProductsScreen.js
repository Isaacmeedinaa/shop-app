import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { Item, HeaderButtons } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";

import * as productsAction from "../../store/actions/products";

import ProductItem from "../../components/shop/ProductItem";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";

import colors from "../../constants/colors";

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          title={itemData.item.title}
          onSelect={() => {}}
        >
          <Button color={colors.primary} title="Edit" onPress={() => {}} />
          <Button
            color={colors.primary}
            title="Delete"
            onPress={() => {
              dispatch(productsAction.deleteProduct(itemData.item.id));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({});

export default UserProductsScreen;
