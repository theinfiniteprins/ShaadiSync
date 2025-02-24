import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, message } from 'antd';
import config from '../../configs/config';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await axios.get(`${config.baseUrl}/api/services`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setServices(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            message.error('Failed to fetch services');
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Service Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `₹${price}`,
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
                <h1>Services Management</h1>
            </div>
            <Table 
                columns={columns} 
                dataSource={services} 
                loading={loading}
                rowKey="_id"
            />
        </div>
    );
};

export default Services;