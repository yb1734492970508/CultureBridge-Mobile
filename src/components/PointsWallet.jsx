import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';

const PointsWallet = () => {
  const [balance] = useState(10250);
  const [transactions] = useState([
    {
      id: 1,
      type: 'received',
      amount: 500,
      date: 'Apr 22, 2024',
      description: 'Cultural content reward'
    },
    {
      id: 2,
      type: 'sent',
      amount: -700,
      date: 'Apr 22, 2024',
      description: 'Language lesson purchase'
    },
    {
      id: 3,
      type: 'received',
      amount: 1200,
      date: 'Apr 21, 2024',
      description: 'Community participation bonus'
    },
    {
      id: 4,
      type: 'sent',
      amount: -400,
      date: 'Apr 21, 2024',
      description: 'Cultural exchange fee'
    }
  ]);

  return (
    <div className="points-wallet">
      {/* Header */}
      <div className="wallet-header">
        <h1 className="wallet-title">积分钱包</h1>
      </div>

      {/* Balance Card */}
      <div className="balance-section">
        <div className="balance-label">TOKEN BALANCE</div>
        <div className="balance-card">
          <div className="balance-amount">
            {balance.toLocaleString()} 积分
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="wallet-actions">
        <button className="action-btn send-btn">
          <div className="action-icon send-icon">
            <ArrowUpRight size={24} />
          </div>
          <span className="action-label">Send</span>
        </button>
        
        <button className="action-btn receive-btn">
          <div className="action-icon receive-icon">
            <ArrowDownLeft size={24} />
          </div>
          <span className="action-label">Receive</span>
        </button>
      </div>

      {/* Transaction History */}
      <div className="transaction-section">
        <h2 className="section-title">TRANSACTION HISTORY</h2>
        
        <div className="transaction-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                <div className={`transaction-icon-circle ${transaction.type}`}>
                  {transaction.type === 'received' ? (
                    <ArrowDownLeft size={20} />
                  ) : (
                    <ArrowUpRight size={20} />
                  )}
                </div>
              </div>
              
              <div className="transaction-details">
                <div className="transaction-type">
                  {transaction.type === 'received' ? 'Received' : 'Sent'}
                </div>
                <div className="transaction-date">{transaction.date}</div>
              </div>
              
              <div className="transaction-amount">
                <span className={`amount ${transaction.type}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} 积分
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-label">This Month</div>
            <div className="stat-value">+2,340 积分</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">
            <div className="activity-dot"></div>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Earned</div>
            <div className="stat-value">15,670 积分</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn">
          <span>Earn More Points</span>
        </button>
        <button className="quick-action-btn secondary">
          <span>View All Transactions</span>
        </button>
      </div>
    </div>
  );
};

export default PointsWallet;

