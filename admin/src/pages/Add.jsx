import React, { useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name,
        description,
        price,
        category,
        subCategory,
        bestseller,
        sizes: JSON.stringify(sizes),
        image1,
        image2,
        image3,
        image4,
      }

      const response = await axios.post(backendUrl + "/api/product/add", payload, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1('')
        setImage2('')
        setImage3('')
        setImage4('')
        setPrice('')
        setSizes([])
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Images Upload Section */}
      <div>
        <p className="mb-2 text-gray-600">Image URLs</p>
        <div className="flex flex-col gap-2 w-full max-w-[500px] sm:max-w-md">
          <input value={image1} onChange={(e) => setImage1(e.target.value)} className="w-full px-3 py-2 border rounded text-sm outline-none focus:border-gray-400" type="text" placeholder="Image URL 1" />
          <input value={image2} onChange={(e) => setImage2(e.target.value)} className="w-full px-3 py-2 border rounded text-sm outline-none focus:border-gray-400" type="text" placeholder="Image URL 2" />
          <input value={image3} onChange={(e) => setImage3(e.target.value)} className="w-full px-3 py-2 border rounded text-sm outline-none focus:border-gray-400" type="text" placeholder="Image URL 3" />
          <input value={image4} onChange={(e) => setImage4(e.target.value)} className="w-full px-3 py-2 border rounded text-sm outline-none focus:border-gray-400" type="text" placeholder="Image URL 4" />
        </div>

        <div className="mt-3 flex flex-wrap gap-3 max-w-[500px] sm:max-w-md">
          {[image1, image2, image3, image4].map((imageUrl, index) => (
            imageUrl ? (
              <div key={index} className="w-20 h-20 border rounded overflow-hidden bg-slate-50">
                <img
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full mt-2">
        <p className="mb-2 text-gray-600">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2 border rounded text-sm sm:max-w-md outline-none focus:border-gray-400" type="text" placeholder="Type here" required />
      </div>

      {/* Product Description */}
      <div className="w-full mt-2">
        <p className="mb-2 text-gray-600">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2 border rounded text-sm sm:max-w-md outline-none focus:border-gray-400" rows={4} placeholder="Write content here" required />
      </div>

      {/* Dropdowns and Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full mt-2 sm:gap-8">
        <div>
          <p className="mb-2 text-gray-600">Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full px-3 py-2 border rounded text-sm outline-none">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-gray-600">Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className="w-full px-3 py-2 border rounded text-sm outline-none">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-gray-600">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 border rounded text-sm sm:w-[120px] outline-none focus:border-gray-400" type="number" placeholder="25" required />
        </div>
      </div>

      {/* Sizes Selection */}
      <div className="mt-2">
        <p className="mb-2 text-gray-600">Product Sizes</p>
        <div className="flex gap-3 text-sm">
          {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <div onClick={() => toggleSize(size)} key={size}>
              <p className={`px-3 py-1 cursor-pointer border rounded ${sizes.includes(size) ? 'bg-pink-100 border-pink-300' : 'bg-slate-50 text-gray-600'}`}>
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex items-center gap-2 mt-2">
        <input onChange={(e) => setBestseller(e.target.checked)} checked={bestseller} type="checkbox" id="bestseller" className="w-4 h-4 cursor-pointer" />
        <label className="cursor-pointer text-gray-600 text-sm" htmlFor="bestseller">Add to bestseller</label>
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors">
        ADD
      </button>

    </form>
  )
}

export default Add