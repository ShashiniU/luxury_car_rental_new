import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cars', {
        params: { brand, minPrice, maxPrice },
      });
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  return (
    <div className="car-list">
      <h2>Browse Luxury Cars</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={fetchCars}>Search</button>
      </div>
      <div className="car-grid">
        {cars.map((car) => (
          <div key={car._id} className="car-card">
            <img src={car.images[0] || '/placeholder.svg'} alt={car.model} />
            <h3>{car.brand} {car.model}</h3>
            <p>Year: {car.year}</p>
            <p>Price: ${car.price} per day</p>
            <p>{car.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
