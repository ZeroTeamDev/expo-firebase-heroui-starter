/**
 * E-commerce Screen
 * Created by Kien AI (leejungkiin@gmail.com)
 *
 * E-commerce example with analytics tracking
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'heroui-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from 'heroui-native';
import { FormButton } from '@/components/forms/FormButton';
import { DataCard, DataGrid } from '@/components/data';
import { MediaImage } from '@/components/media';
import { Badge } from '@/components/feedback/Badge';
import { useToast } from '@/components/feedback/Toast';
import { logEvent, logViewItem, logAddToCart, logPurchase } from '@/services/analytics';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    description: 'Premium wireless headphones with noise cancellation',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'Feature-rich smartwatch with fitness tracking',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    description: 'Ergonomic aluminum laptop stand',
    category: 'Accessories',
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    description: 'RGB mechanical keyboard with customizable keys',
    category: 'Accessories',
  },
];

export default function EcommerceScreen() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewedProduct, setViewedProduct] = useState<Product | null>(null);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const handleViewProduct = (product: Product) => {
    setViewedProduct(product);
    logViewItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      currency: 'USD',
    });
  };

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }

    logAddToCart({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: 1,
      currency: 'USD',
    });

    showToast({
      title: 'Added to Cart',
      message: `${product.name} added to cart`,
      variant: 'success',
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    logPurchase({
      transaction_id: `TXN-${Date.now()}`,
      value: total,
      currency: 'USD',
      items: cart.map((item) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });

    showToast({
      title: 'Purchase Complete',
      message: `Thank you for your purchase of $${total.toFixed(2)}!`,
      variant: 'success',
    });

    setCart([]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="E-commerce"
        subtitle="Shop example with analytics"
        trailing={
          <TouchableOpacity
            onPress={() => {
              // Navigate to cart view
            }}
            style={styles.cartButton}
          >
            <Badge label={cart.length.toString()} variant="danger" />
            <Text style={[styles.cartText, { color: colors.foreground }]}>Cart</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="mb-4 rounded-xl">
            <Card.Body style={{ padding: 16, gap: 12 }}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Cart ({cart.length} items)
              </Text>
              {cart.map((item) => (
                <View key={item.product.id} style={styles.cartItem}>
                  <Text style={[styles.cartItemName, { color: colors.foreground }]}>
                    {item.product.name}
                  </Text>
                  <View style={styles.cartItemActions}>
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      style={[styles.quantityButton, { backgroundColor: colors.muted }]}
                    >
                      <Text style={{ color: colors.foreground }}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.quantity, { color: colors.foreground }]}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      style={[styles.quantityButton, { backgroundColor: colors.muted }]}
                    >
                      <Text style={{ color: colors.foreground }}>+</Text>
                    </TouchableOpacity>
                    <Text style={[styles.price, { color: colors.foreground }]}>
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
              <View style={styles.total}>
                <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total:</Text>
                <Text style={[styles.totalValue, { color: colors.accent }]}>
                  ${total.toFixed(2)}
                </Text>
              </View>
              <FormButton title="Checkout" onPress={handleCheckout} />
            </Card.Body>
          </Card>
        )}

        {/* Products Grid */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Products</Text>
        <DataGrid
          data={MOCK_PRODUCTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card className="rounded-xl overflow-hidden">
              <MediaImage
                source={{ uri: item.image }}
                alt={item.name}
                aspectRatio={1}
                borderRadius={0}
              />
              <Card.Body style={{ padding: 12, gap: 8 }}>
                <Text style={[styles.productName, { color: colors.foreground }]}>
                  {item.name}
                </Text>
                <Text style={[styles.productDescription, { color: colors.mutedForeground }]}>
                  {item.description}
                </Text>
                <View style={styles.productFooter}>
                  <Text style={[styles.productPrice, { color: colors.accent }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <FormButton
                    title="Add to Cart"
                    onPress={() => handleAddToCart(item)}
                    size="sm"
                  />
                </View>
              </Card.Body>
            </Card>
          )}
          minColumnWidth={180}
          spacing={12}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cartItemName: {
    fontSize: 14,
    flex: 1,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
});

