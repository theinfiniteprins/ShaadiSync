import React, { useState, useEffect } from 'react';
import { Table, Select, Card, Row, Col, Statistic, Space, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import config from '../../configs/config';

const { Option } = Select;

const ArtistTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('24hours');
    const [statistics, setStatistics] = useState({
        totalEarnings: 0,
        totalDebits: 0,
        totalCredits: 0,
        totalTransactions: 0
    });
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchTransactions();
    }, [timeRange]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.get(`${config.baseUrl}/api/artist-transactions/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const allTransactions = response.data;
            
            // Filter transactions based on selected time range
            const filteredTransactions = allTransactions.filter(transaction => {
                const transactionDate = moment(transaction.createdAt);
                const now = moment();

                switch (timeRange) {
                    case '24hours':
                        return transactionDate.isAfter(now.subtract(24, 'hours'));
                    case '7days':
                        return transactionDate.isAfter(now.subtract(7, 'days'));
                    case 'month':
                        return transactionDate.isAfter(now.subtract(1, 'month'));
                    default: // 'all'
                        return true;
                }
            });

            // Calculate statistics
            const totalEarnings = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);
            const totalDebits = filteredTransactions.filter(t => t.type === 'debit').length;
            const totalCredits = filteredTransactions.filter(t => t.type === 'credit').length;

            setTransactions(filteredTransactions);
            setStatistics({
                totalEarnings,
                totalDebits,
                totalCredits,
                totalTransactions: filteredTransactions.length
            });
        } catch (error) {
            console.error('Error details:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
        },
        {
            title: 'Transaction Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'credit' ? 'green' : 'red'}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `₹${amount.toFixed(2)}`,
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h1>Artist Transactions</h1>
            
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic 
                            title="Total Earnings" 
                            value={statistics.totalEarnings}
                            valueStyle={{ color: 'green' }}
                            prefix="₹"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic 
                            title="Total Debits" 
                            value={statistics.totalDebits}
                            valueStyle={{ color: 'red' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic 
                            title="Total Credits" 
                            value={statistics.totalCredits}
                            valueStyle={{ color: 'green' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic 
                            title="Total Transactions" 
                            value={statistics.totalTransactions}
                        />
                    </Card>
                </Col>
            </Row>

            <Space style={{ marginBottom: '16px' }}>
                <Select 
                    defaultValue="24hours" 
                    style={{ width: 200 }} 
                    onChange={(value) => setTimeRange(value)}
                >
                    <Option value="24hours">Last 24 Hours</Option>
                    <Option value="7days">Last 7 Days</Option>
                    <Option value="month">Last Month</Option>
                    <Option value="all">All Time</Option>
                </Select>
            </Space>

            <Table 
                columns={columns}
                dataSource={transactions}
                loading={loading}
                rowKey="_id"
                pagination={{
                    pageSize: pageSize,
                    pageSizeOptions: ['10', '25', '50', '100'],
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
                    onShowSizeChange: (current, size) => {
                        setPageSize(size);
                    },
                }}
            />
        </div>
    );
};

export default ArtistTransactions;