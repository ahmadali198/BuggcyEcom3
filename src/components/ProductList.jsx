import React from 'react'; // No direct useCallback/useMemo here
import ProductCard from './ProductCard'; // Assuming ProductCard is already React.memo wrapped

const ProductList = ({
  products,
  onEdit,           // Expected to be memoized by parent (HomePage)
  onDelete,         // Expected to be memoized by parent (HomePage)
  editingProduct,
  editedData,
  handleChange,     // Expected to be memoized by parent (HomePage)
  handleImageUpload, // Expected to be memoized by parent (HomePage)
  handleUpdate,     // Expected to be memoized by parent (HomePage)
  handleCancelEdit, // Expected to be memoized by parent (HomePage)
  categories
}) => {
  // In ProductList, we are simply mapping over 'products' and passing props down.
  // The crucial memoization should happen at two levels:
  // 1. In the Parent component (HomePage) that renders ProductList: It should memoize
  //    all the callback functions (onEdit, onDelete, handleChange, etc.) using `useCallback`.
  //    This ensures that when HomePage re-renders, these function props don't change
  //    unnecessarily, preventing ProductList from re-rendering unless its 'products'
  //    array or other props genuinely change.
  // 2. In ProductCard itself: You've already done this by wrapping ProductCard in `React.memo`.
  //    This means individual ProductCards only re-render if their `product` prop or the
  //    function props passed to them change.

  // Therefore, for ProductList itself, there are no specific `useCallback` or `useMemo`
  // applications directly within this component that would provide significant additional benefits,
  // beyond what's handled by its parent and its children.
  // ProductList is primarily a "pass-through" component for props.

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/*
        The .map() operation here is not typically a performance bottleneck that useMemo
        would solve efficiently without over-complicating the code.
        The performance gains come from ProductCard being memoized (React.memo)
        and the callback functions (onEdit, onDelete, etc.) being memoized
        in the parent component (HomePage) that renders this ProductList.
      */}
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          editingProduct={editingProduct}
          editedData={editedData}
          handleChange={handleChange}
          handleImageUpload={handleImageUpload}
          handleUpdate={handleUpdate}
          handleCancelEdit={handleCancelEdit}
          categories={categories}
        />
      ))}
    </div>
  );
};

// Wrapping ProductList with React.memo is beneficial if the 'products' array
// or any of the other props passed to ProductList are frequently new references
// but contain shallowly equal data.
// Given that `products` (filteredProducts) in HomePage is state, it will be a new
// array reference if items are added/removed/updated.
// However, if the `products` array remains referentially the same (e.g., only
// an item *within* it changes, but the array reference itself doesn't),
// React.memo here would prevent unnecessary re-renders of the entire list.
// For this scenario, it's a good practice.
export default React.memo(ProductList);
