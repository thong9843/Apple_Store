import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      setError("Access denied. Admins only.");
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [navigate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchOrders();
    }
  }, [startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      
      const filteredOrders = data.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
      });
      
      setOrders(filteredOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = () => {
    const deliveredAndShipped = orders.filter(order => 
      ['DELIVERED', 'SHIPPED'].includes(order.orderStatus)
    ).length;

    const totalRevenue = orders
      .filter(order => order.paymentConfirm === 'PAID')
      .reduce((sum, order) => sum + order.total, 0);

    return { deliveredAndShipped, totalRevenue };
  };

  const stats = getStatistics();

  const getChartData = () => {
    const dailyData = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          orders: 0,
          revenue: 0
        };
      }
      dailyData[date].orders++;
      if (order.paymentConfirm === 'PAID') {
        dailyData[date].revenue += order.total;
      }
    });

    return Object.values(dailyData);
  };

  if (error) {
    return (
      <div className="alert alert-danger shadow-sm mx-4 mt-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="bi bi-speedometer2 me-2"></i>
            Admin Dashboard
          </span>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* Date Range Selection */}
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-calendar-range me-2"></i>
                  Select Date Range
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">Start Date</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-calendar-event"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">End Date</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-calendar-event"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="col-md-6">
            <div className="card border-0 bg-primary bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Delivered & Shipped Orders
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">
                      {stats.deliveredAndShipped}
                    </h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-box-seam fs-1"></i>
                  </div>
                </div>
                <p className="card-text mt-3 mb-0">
                  <i className="bi bi-calendar-check me-1"></i>
                  In selected date range
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card border-0 bg-success bg-gradient text-white shadow h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-2 text-white-50">
                      Total Revenue (Paid Orders)
                    </h6>
                    <h2 className="display-4 mb-0 fw-bold">
                      ${stats.totalRevenue.toFixed(2)}
                    </h2>
                  </div>
                  <div className="p-3 bg-white bg-opacity-25 rounded-circle">
                    <i className="bi bi-currency-dollar fs-1"></i>
                  </div>
                </div>
                <p className="card-text mt-3 mb-0">
                  <i className="bi bi-graph-up-arrow me-1"></i>
                  From paid orders in selected range
                </p>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title mb-4 text-center">
                  <i className="bi bi-graph-up me-2"></i>
                  Orders & Revenue Trend
                </h5>
                <div className="d-flex justify-content-center align-items-center">
                  <div style={{ width: '100%', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getChartData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#666"
                          tick={{ fill: '#666' }}
                          tickLine={{ stroke: '#666' }}
                        />
                        <YAxis 
                          yAxisId="left" 
                          stroke="#0d6efd"
                          tick={{ fill: '#0d6efd' }}
                          tickLine={{ stroke: '#0d6efd' }}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          stroke="#198754"
                          tick={{ fill: '#198754' }}
                          tickLine={{ stroke: '#198754' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          wrapperStyle={{
                            paddingBottom: '20px',
                            marginTop: '10px'
                          }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="orders"
                          stroke="#0d6efd"
                          name="Orders"
                          strokeWidth={2}
                          dot={{ stroke: '#0d6efd', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#0d6efd', strokeWidth: 2 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="revenue"
                          stroke="#198754"
                          name="Revenue ($)"
                          strokeWidth={2}
                          dot={{ stroke: '#198754', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#198754', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;