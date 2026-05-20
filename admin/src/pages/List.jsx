import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'

const List = ({ token }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(backendUrl + '/api/product/list')

      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">All Products</h2>
        <button
          onClick={fetchList}
          className="px-4 py-2 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[80px_2fr_1fr_1fr_120px] gap-4 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 border-b">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p>Action</p>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No products found.</div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-[80px_2fr_1fr_1fr_120px] gap-4 items-center px-4 py-3 text-sm border-b last:border-b-0"
            >
              <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden border border-gray-200">
                {product.image?.[0] ? (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <p className="text-gray-700 font-medium truncate">{product.name}</p>
              <p className="text-gray-600">{product.category} / {product.subCategory}</p>
              <p className="text-gray-600">₹{product.price}</p>
              <button
                onClick={() => removeProduct(product._id)}
                className="px-3 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors w-fit"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default List