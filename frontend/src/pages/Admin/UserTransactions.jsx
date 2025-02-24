import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Select, Card, Row, Col, Statistic, Space, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import config from '../../configs/config';

const { RangePicker } = DatePicker;
const { Option } = Select;

const UserTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('24hours');
    const [statistics, setStatistics] = useState({
        totalSyncCoinsIssued: 0,
        totalSyncCoinsUsed: 0,
        totalSyncCoinsBought: 0,
        totalDebits: 0
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

            const response = await axios.get(`${config.baseUrl}/api/user-transaction-history/AllTransactions`, {
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

            // Calculate statistics based on filtered transactions
            const totalSyncCoinsIssued = filteredTransactions.reduce((acc, curr) => 
                curr.transactionType === 'credit' ? acc + curr.syncCoin : acc, 0);

            const totalSyncCoinsUsed = filteredTransactions.reduce((acc, curr) => 
                curr.transactionType === 'debit' ? acc + Math.abs(curr.syncCoin) : acc, 0);

            const totalSyncCoinsBought = filteredTransactions.reduce((acc, curr) => {
                const descLower = curr.description.toLowerCase();
                return (curr.transactionType === 'credit' && descLower.includes('bought') ) 
                    ? acc + curr.syncCoin 
                    : acc;
            }, 0);

            const totalDebits = filteredTransactions.filter(t => t.transactionType === 'debit').length;

            setTransactions(filteredTransactions);
            setStatistics({
                totalSyncCoinsIssued,
                totalSyncCoinsUsed,
                totalSyncCoinsBought,
                totalDebits
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
            dataIndex: 'transactionType',
            key: 'transactionType',
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
        },
        {
            title: 'SyncCoins',
            dataIndex: 'syncCoin',
            key: 'syncCoin',
            render: (coins, record) => (
                <span style={{ color: record.transactionType === 'credit' ? 'green' : 'red' }}>
                    {record.transactionType === 'credit' ? '+' : '-'}{Math.abs(coins)}
                </span>
            ),
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h1>User Transactions</h1>
            
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic 
                            title="Total SyncCoins Issued" 
                            value={statistics.totalSyncCoinsIssued}
                            valueStyle={{ color: 'green' }}
                            prefix="+"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic 
                            title="Total SyncCoins Used" 
                            value={statistics.totalSyncCoinsUsed}
                            valueStyle={{ color: 'red' }}
                            prefix="-"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic 
                            title="Total SyncCoins Bought" 
                            value={statistics.totalSyncCoinsBought}
                            valueStyle={{ color: 'blue' }}
                            prefix="+"
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

export default UserTransactions;