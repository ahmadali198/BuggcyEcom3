// components/productcard.jsx
import React, { useCallback, useMemo } from 'react'; // Import useCallback and useMemo
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Save, XCircle, UploadCloud, Image as ImageIcon } from 'lucide-react';

const ProductCard = ({
  product,
  onEdit, // Expect this to be useCallback from parent
  onDelete, // Expect this to be useCallback from parent
  editingProduct,
  editedData,
  handleChange, // Expect this to be useCallback from parent
  handleImageUpload, // Expect this to be useCallback from parent
  handleUpdate, // Expect this to be useCallback from parent
  handleCancelEdit, // Expect this to be useCallback from parent
  categories // New prop
}) => {
  // Memoize the renderStars helper function.
  // This function does not depend on any changing props of ProductCard.
  const memoizedRenderStars = useCallback((rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-500">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500 relative">
          ★
          <span className="absolute top-0 left-0 w-1/2 overflow-hidden text-gray-300 dark:text-gray-600">
            ★
          </span>
        </span>
      );
    }

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">
          ★
        </span>
      );
    }
    return stars;
  }, []); // Empty dependency array means it's created once and never changes

  // Memoize the onError handler for the image
  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/200x200/cccccc/333333?text=No+Image`;
  }, []); // Empty dependency array as it doesn't rely on product-specific data

  const isEditing = editingProduct === product.id;

  // Determine if the card should be clickable (only for non-local products)
  // useMemo ensures this boolean is only re-calculated if product.isLocal changes.
  const isClickable = useMemo(() => !product.isLocal, [product.isLocal]);

  // Memoize the entire display-mode content of the card.
  // This helps prevent re-creation of this JSX subtree unless relevant props change.
  // This is a more advanced use of useMemo for JSX, primarily useful if this subtree is large
  // and its components are not already memoized, or to avoid inline object creation.
  const cardDisplayContent = useMemo(() => (
    // --- Display Mode ---
    <div className="p-5 flex flex-col h-full text-left">
      {/* Product Image */}
      <div className="flex-shrink-0 flex items-center justify-center h-48 mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain mx-auto mix-blend-multiply dark:mix-blend-normal
                       transform transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError} // Use memoized handler
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between text-left">
        {/* Title */}
        <h2
          className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white leading-tight text-left"
          title={product.title}
        >
          {product.title}
        </h2>

        {/* Reviews (Rating & Count) */}
        {product.rating && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2 text-left">
            <div className="flex mr-1">
              {memoizedRenderStars(product.rating.rate)}
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {product.rating.rate.toFixed(1)}
            </span>
            <span className="ml-1">({product.rating.count} reviews)</span>
          </div>
        )}

        {/* Price */}
        <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-auto text-left">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Edit/Delete Buttons (only for local products) */}
      {product.isLocal && (
        <div className="flex justify-between mt-4 space-x-3">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(product); }} // Prevent Link navigation. Parent must memoize onEdit.
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-yellow-400 rounded-lg text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm font-medium"
            title="Edit Product"
          >
            <Edit2 size={16} className="mr-2" /> Edit
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onDelete(product.id); }} // Prevent Link navigation. Parent must memoize onDelete.
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-red-400 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
            title="Delete Product"
          >
            <Trash2 size={16} className="mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  ), [product, memoizedRenderStars, handleImageError, onEdit, onDelete]); // Dependencies: product (for its data), memoized functions

  // Memoize the entire edit-mode content of the card.
  const cardEditContent = useMemo(() => (
    // --- Edit Mode ---
    <div className="p-5 space-y-4 text-left w-full">
      {/* Image Upload Area for Edit Mode */}
      <div
        className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg
                   flex flex-col items-center justify-center cursor-pointer overflow-hidden
                   border-2 border-dashed border-gray-300 dark:border-gray-600 group"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload} // Parent must memoize handleImageUpload
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Upload new product image"
        />
        {editedData.image ? (
          <>
            <img
              src={editedData.image}
              alt="Image Preview"
              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-sm font-medium">
              <UploadCloud size={24} className="mr-2" /> Click or drag to change image
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            <ImageIcon size={48} className="transition-transform duration-200 group-hover:scale-110" />
            <p className="text-sm font-medium">No image selected. Click to upload.</p>
          </div>
        )}
      </div>

      {/* Input Fields for Edit */}
      <input
        type="text"
        name="title"
        value={editedData.title || ""}
        onChange={handleChange} // Parent must memoize handleChange
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Product Title"
      />
      <input
        type="number"
        name="price"
        value={editedData.price || ""}
        onChange={handleChange} // Parent must memoize handleChange
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Price"
        min="0"
        step="0.01"
      />
      <select
        name="category"
        value={editedData.category || ""}
        onChange={handleChange} // Parent must memoize handleChange
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className="capitalize">
            {cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </option>
        ))}
      </select>
      <textarea
        name="description"
        value={editedData.description || ""}
        onChange={handleChange} // Parent must memoize handleChange
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                   bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-y
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={3}
        placeholder="Description"
      ></textarea>

      {/* Action Buttons for Edit Mode */}
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={handleUpdate} // Parent must memoize handleUpdate
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md
                     hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                     transition-colors text-sm"
        >
          <Save size={18} className="mr-2" /> Save
        </button>
        <button
          onClick={handleCancelEdit} // Parent must memoize handleCancelEdit
          className="inline-flex items-center px-4 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md
                     hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
                     transition-colors text-sm"
        >
          <XCircle size={18} className="mr-2" /> Cancel
        </button>
      </div>
    </div>
  ), [editedData, handleChange, handleImageUpload, handleUpdate, handleCancelEdit, categories]); // Dependencies: all props used in this JSX

  console.log(`ProductCard (${product.id}) rendered. Editing: ${isEditing}`); // For debugging re-renders

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl
                    transform transition-all duration-300
                    hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl
                    flex flex-col h-full overflow-hidden group font-inter">
      {isEditing ? (
        cardEditContent // Render memoized edit content
      ) : (
        // Conditionally render Link or just the memoized display content
        isClickable ? (
          <Link
            to={`/product/${product.id}`}
            className="block flex flex-col h-full overflow-hidden group font-inter"
          >
            {cardDisplayContent} {/* Render memoized display content */}
          </Link>
        ) : (
          cardDisplayContent /* Render memoized display content */
        )
      )}
    </div>
  );
};

// Wrap the component with React.memo for performance optimization.
// This prevents re-renders if props haven't shallowly changed.
export default React.memo(ProductCard);
