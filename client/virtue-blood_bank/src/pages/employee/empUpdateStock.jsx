import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/styles/emp/updateStock.css';

const UpdateStock = () => {
  const [stock, setStock] = useState([]);
  console.log("Fetching blood stocks...");

  const fetchBloodStocks = () => {
    axios.get("http://localhost:4000/emp/blood-stocks", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log("Blood stocks API response:", response.data);

      const stockData = response.data.data;
      setStock(stockData);
    })
    .catch(error => {
      console.log("**ERROR**", error);
      toast.error("An error occurred while fetching blood stocks.");
    });
  };

  useEffect(() => {
    fetchBloodStocks();
  }, []);

  const updateBloodStock = (id, unitUpdate) => {
    axios
      .put(`http://localhost:4000/emp/blood-stocks/${id}`, { unit: unitUpdate }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (response.data.status === "success") {
          console.log("Blood stock unit updated successfully.");
          const updatedStock = stock.map(s => {
            if (s.id === id) {
              return { ...s, unit: unitUpdate };
            }
            return s;
          });
          setStock(updatedStock);
          toast.success("Blood unit updated successfully");
          fetchBloodStocks(); // Reload blood stock data after update
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(error => {
        console.error(error);

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred while updating blood unit.');
        }
      });

  };

  const handleUnitChange = (id, event) => {
    const newUnit = event.target.value;
    const updatedStock = stock.map(s => {
      if (s.id === id) {
        return { ...s, unit: newUnit };
      }
      return s;
    });
    setStock(updatedStock);
  };

  return (
    <div className="center5">
      <div className="table-responsive5">
        <h1 className="table-heading5">Blood Stock</h1>
        
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Blood ID</th>
              <th>Blood Group</th>
              <th>Last Updated</th>
              <th>Units</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.blood_group}</td>
                <td>{s.updated_at}</td>
                <td>
                  <input
                    className="input-field5"
                    type="text"
                    value={s.unit}
                    onChange={(event) => handleUnitChange(s.id, event)}
                  />
                </td>
                <td>
                  <button
                    className="update-button5"
                    onClick={() => updateBloodStock(s.id, s.unit)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdateStock;
