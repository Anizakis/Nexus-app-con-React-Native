import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = useCallback((item, type = 'book') => {
    if (!item?.id) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.type === type);
      if (existing) {
        return prev.map((i) => i.id === item.id && i.type === type ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1, type }];
    });
  }, []);

  const removeItem = useCallback((id, type) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + (Number(i.precio) || 0) * i.qty, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((acc, i) => acc + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clear, total, count }),
    [items, addItem, removeItem, clear, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
