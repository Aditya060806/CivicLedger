const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory data storage (simulating ICP stable storage)
const dataStore = {
  policies: new Map(),
  complaints: new Map(),
  proposals: new Map(),
  transactions: new Map(),
  users: new Map(),
  sessions: new Map()
};

// Initialize with sample data
const initializeData = () => {
  // Sample policies
  const policy1 = {
    id: uuidv4(),
    title: "PM Awas Yojana - Phase 3",
    description: "Housing for All scheme providing affordable housing to urban poor",
    category: "Housing",
    fund_allocation: 5000000000n, // 5 crore
    fund_released: 2500000000n, // 2.5 crore
    beneficiaries: 1250,
    status: "Active",
    created_at: BigInt(Date.now() * 1000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: "Mumbai",
    contractor: "ABC Construction Ltd",
    eligibility_criteria: ["Below Poverty Line", "Urban residence", "No existing house"],
    execution_conditions: ["House completion within 18 months", "Quality standards compliance"],
    smart_contract_code: "// Smart contract for PM Awas Yojana\ncontract PMAYContract {\n    // Implementation details\n}"
  };

  const policy2 = {
    id: uuidv4(),
    title: "Digital India Infrastructure",
    description: "Building digital infrastructure across rural areas",
    category: "Technology",
    fund_allocation: 3000000000n, // 3 crore
    fund_released: 1500000000n, // 1.5 crore
    beneficiaries: 500,
    status: "Active",
    created_at: BigInt(Date.now() * 1000000),
    updated_at: BigInt(Date.now() * 1000000),
    district: "Bangalore",
    contractor: "Tech Solutions Inc",
    eligibility_criteria: ["Rural areas", "No internet connectivity"],
    execution_conditions: ["Fiber optic installation", "WiFi hotspot setup"],
    smart_contract_code: "// Smart contract for Digital India\ncontract DigitalIndiaContract {\n    // Implementation details\n}"
  };

  dataStore.policies.set(policy1.id, policy1);
  dataStore.policies.set(policy2.id, policy2);

  // Sample complaints
  const complaint1 = {
    id: uuidv4(),
    title: "Delayed Construction Work",
    description: "PM Awas Yojana construction has been delayed by 3 months",
    category: "Infrastructure",
    priority: "High",
    status: "UnderReview",
    policy_id: policy1.id,
    district: "Mumbai",
    location: "Andheri West",
    media_links: ["photo1.jpg", "photo2.jpg"],
    citizen_id: "citizen-001",
    created_at: BigInt(Date.now() * 1000000),
    updated_at: BigInt(Date.now() * 1000000),
    ai_analysis: {
      sentiment: "negative",
      category_prediction: "construction_delay",
      priority_score: 0.8,
      suggested_action: "Investigate contractor performance",
      confidence: 0.85,
      keywords: ["delay", "construction", "timeline"]
    },
    audit_score: 0.7,
    resolution_time: null
  };

  dataStore.complaints.set(complaint1.id, complaint1);

  // Sample proposals
  const proposal1 = {
    id: uuidv4(),
    title: "Increase Fund Allocation for Rural Areas",
    description: "Proposal to increase fund allocation for rural development schemes",
    category: "Governance",
    proposer: "citizen-002",
    created_at: BigInt(Date.now() * 1000000),
    voting_start: BigInt(Date.now() * 1000000),
    voting_end: BigInt(Date.now() * 1000000 + 7 * 24 * 3600 * 1000000000), // 7 days
    status: "Active",
    yes_votes: 45,
    no_votes: 12,
    abstain_votes: 3,
    total_votes: 60,
    quorum_required: 50,
    execution_data: null
  };

  dataStore.proposals.set(proposal1.id, proposal1);

  // Sample transactions
  const transaction1 = {
    id: uuidv4(),
    policy_id: policy1.id,
    transaction_type: "Allocation",
    amount: 5000000000n,
    from_address: "government_treasury",
    to_address: "policy_contract",
    timestamp: BigInt(Date.now() * 1000000),
    status: "Completed",
    transaction_hash: "0x" + Math.random().toString(16).substr(2, 16),
    metadata: [["purpose", "initial_allocation"], ["scheme", "pmay"]]
  };

  const transaction2 = {
    id: uuidv4(),
    policy_id: policy1.id,
    transaction_type: "Release",
    amount: 2500000000n,
    from_address: "policy_contract",
    to_address: "contractor_wallet",
    timestamp: BigInt(Date.now() * 1000000),
    status: "Completed",
    transaction_hash: "0x" + Math.random().toString(16).substr(2, 16),
    metadata: [["purpose", "construction_payment"], ["phase", "foundation"]]
  };

  dataStore.transactions.set(transaction1.id, transaction1);
  dataStore.transactions.set(transaction2.id, transaction2);
};

// Initialize data
initializeData();

// Utility functions
const formatBigInt = (value) => {
  return (Number(value) / 100000000).toFixed(2);
};

const formatTimestamp = (timestamp) => {
  return new Date(Number(timestamp) / 1000000).toLocaleString();
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send real-time updates
  socket.emit('connected', { message: 'Connected to CivicLedger Backend' });

  // Handle policy updates
  socket.on('subscribe_policies', () => {
    socket.join('policies');
    const serializedPolicies = Array.from(dataStore.policies.values()).map(p => ({
      ...p,
      fund_allocation: p.fund_allocation.toString(),
      fund_released: p.fund_released.toString(),
      created_at: p.created_at.toString(),
      updated_at: p.updated_at.toString()
    }));
    socket.emit('policies_update', serializedPolicies);
  });

  // Handle complaint updates
  socket.on('subscribe_complaints', () => {
    socket.join('complaints');
    const serializedComplaints = Array.from(dataStore.complaints.values()).map(c => ({
      ...c,
      created_at: c.created_at.toString(),
      updated_at: c.updated_at.toString(),
      resolution_time: c.resolution_time ? c.resolution_time.toString() : null
    }));
    socket.emit('complaints_update', serializedComplaints);
  });

  // Handle proposal updates
  socket.on('subscribe_proposals', () => {
    socket.join('proposals');
    const serializedProposals = Array.from(dataStore.proposals.values()).map(p => ({
      ...p,
      created_at: p.created_at.toString(),
      voting_start: p.voting_start.toString(),
      voting_end: p.voting_end.toString()
    }));
    socket.emit('proposals_update', serializedProposals);
  });

  // Handle transaction updates
  socket.on('subscribe_transactions', () => {
    socket.join('transactions');
    const serializedTransactions = Array.from(dataStore.transactions.values()).map(t => ({
      ...t,
      amount: t.amount.toString(),
      timestamp: t.timestamp.toString()
    }));
    socket.emit('transactions_update', serializedTransactions);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'CivicLedger Backend'
  });
});

// Smart Policy Routes
app.get('/api/policies', (req, res) => {
  try {
    const policies = Array.from(dataStore.policies.values()).map(policy => ({
      ...policy,
      fund_allocation: policy.fund_allocation.toString(),
      fund_released: policy.fund_released.toString(),
      created_at: policy.created_at.toString(),
      updated_at: policy.updated_at.toString()
    }));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/policies/:id', (req, res) => {
  try {
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    const serializedPolicy = {
      ...policy,
      fund_allocation: policy.fund_allocation.toString(),
      fund_released: policy.fund_released.toString(),
      created_at: policy.created_at.toString(),
      updated_at: policy.updated_at.toString()
    };
    res.json(serializedPolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/policies', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      fund_allocation,
      district,
      eligibility_criteria,
      execution_conditions
    } = req.body;

    const policy = {
      id: uuidv4(),
      title,
      description,
      category,
      fund_allocation: BigInt(fund_allocation),
      fund_released: 0n,
      beneficiaries: 0,
      status: "Draft",
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      district,
      contractor: null,
      eligibility_criteria,
      execution_conditions,
      smart_contract_code: `// Smart Contract for ${title}\ncontract ${title.replace(/\s+/g, '')}Contract {\n    // Auto-generated contract\n}`
    };

    dataStore.policies.set(policy.id, policy);
    
    // Emit real-time update
    const serializedPolicies = Array.from(dataStore.policies.values()).map(p => ({
      ...p,
      fund_allocation: p.fund_allocation.toString(),
      fund_released: p.fund_released.toString(),
      created_at: p.created_at.toString(),
      updated_at: p.updated_at.toString()
    }));
    io.to('policies').emit('policies_update', serializedPolicies);
    
    const serializedPolicy = {
      ...policy,
      fund_allocation: policy.fund_allocation.toString(),
      fund_released: policy.fund_released.toString(),
      created_at: policy.created_at.toString(),
      updated_at: policy.updated_at.toString()
    };
    res.status(201).json(serializedPolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/policies/:id/activate', (req, res) => {
  try {
    const policy = dataStore.policies.get(req.params.id);
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    policy.status = "Active";
    policy.updated_at = BigInt(Date.now() * 1000000);
    
    // Emit real-time update
    const serializedPolicies = Array.from(dataStore.policies.values()).map(p => ({
      ...p,
      fund_allocation: p.fund_allocation.toString(),
      fund_released: p.fund_released.toString(),
      created_at: p.created_at.toString(),
      updated_at: p.updated_at.toString()
    }));
    io.to('policies').emit('policies_update', serializedPolicies);
    
    const serializedPolicy = {
      ...policy,
      fund_allocation: policy.fund_allocation.toString(),
      fund_released: policy.fund_released.toString(),
      created_at: policy.created_at.toString(),
      updated_at: policy.updated_at.toString()
    };
    res.json(serializedPolicy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/policies/:id/release-funds', (req, res) => {
  try {
    const { amount, to_address } = req.body;
    const policy = dataStore.policies.get(req.params.id);
    
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    const releaseAmount = BigInt(amount);
    if (policy.fund_released + releaseAmount > policy.fund_allocation) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    policy.fund_released += releaseAmount;
    policy.updated_at = BigInt(Date.now() * 1000000);

    // Create transaction record
    const transaction = {
      id: uuidv4(),
      policy_id: policy.id,
      transaction_type: "Release",
      amount: releaseAmount,
      from_address: "government_treasury",
      to_address,
      timestamp: BigInt(Date.now() * 1000000),
      status: "Completed",
      transaction_hash: "0x" + Math.random().toString(16).substr(2, 16),
      metadata: [["purpose", "fund_release"], ["recipient", to_address]]
    };

    dataStore.transactions.set(transaction.id, transaction);
    
    // Emit real-time updates
    const serializedPolicies = Array.from(dataStore.policies.values()).map(p => ({
      ...p,
      fund_allocation: p.fund_allocation.toString(),
      fund_released: p.fund_released.toString(),
      created_at: p.created_at.toString(),
      updated_at: p.updated_at.toString()
    }));
    const serializedTransactions = Array.from(dataStore.transactions.values()).map(t => ({
      ...t,
      amount: t.amount.toString(),
      timestamp: t.timestamp.toString()
    }));
    io.to('policies').emit('policies_update', serializedPolicies);
    io.to('transactions').emit('transactions_update', serializedTransactions);
    
    const serializedPolicy = {
      ...policy,
      fund_allocation: policy.fund_allocation.toString(),
      fund_released: policy.fund_released.toString(),
      created_at: policy.created_at.toString(),
      updated_at: policy.updated_at.toString()
    };
    res.json({ policy: serializedPolicy, transaction_id: transaction.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complaint Routes
app.get('/api/complaints', (req, res) => {
  try {
    const complaints = Array.from(dataStore.complaints.values()).map(complaint => ({
      ...complaint,
      created_at: complaint.created_at.toString(),
      updated_at: complaint.updated_at.toString(),
      resolution_time: complaint.resolution_time ? complaint.resolution_time.toString() : null
    }));
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/complaints', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      policy_id,
      district,
      location,
      media_links,
      citizen_id
    } = req.body;

    const complaint = {
      id: uuidv4(),
      title,
      description,
      category,
      priority,
      status: "Submitted",
      policy_id,
      district,
      location,
      media_links: media_links || [],
      citizen_id,
      created_at: BigInt(Date.now() * 1000000),
      updated_at: BigInt(Date.now() * 1000000),
      ai_analysis: {
        sentiment: description.includes("delay") || description.includes("problem") ? "negative" : "neutral",
        category_prediction: category,
        priority_score: priority === "Critical" ? 0.9 : priority === "High" ? 0.7 : priority === "Medium" ? 0.5 : 0.3,
        suggested_action: "Investigate and respond within 48 hours",
        confidence: 0.85,
        keywords: ["government", "service", "issue"]
      },
      audit_score: 0.5,
      resolution_time: null
    };

    dataStore.complaints.set(complaint.id, complaint);
    
    // Emit real-time update
    const serializedComplaints = Array.from(dataStore.complaints.values()).map(c => ({
      ...c,
      created_at: c.created_at.toString(),
      updated_at: c.updated_at.toString(),
      resolution_time: c.resolution_time ? c.resolution_time.toString() : null
    }));
    io.to('complaints').emit('complaints_update', serializedComplaints);
    
    const serializedComplaint = {
      ...complaint,
      created_at: complaint.created_at.toString(),
      updated_at: complaint.updated_at.toString(),
      resolution_time: complaint.resolution_time ? complaint.resolution_time.toString() : null
    };
    res.status(201).json(serializedComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DAO Routes
app.get('/api/proposals', (req, res) => {
  try {
    const proposals = Array.from(dataStore.proposals.values()).map(proposal => ({
      ...proposal,
      created_at: proposal.created_at.toString(),
      voting_start: proposal.voting_start.toString(),
      voting_end: proposal.voting_end.toString()
    }));
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/proposals', (req, res) => {
  try {
    const {
      title,
      description,
      category,
      proposer,
      voting_duration_hours,
      quorum_required
    } = req.body;

    const now = BigInt(Date.now() * 1000000);
    const votingStart = now + BigInt(3600 * 1000000000); // 1 hour from now
    const votingEnd = votingStart + (BigInt(voting_duration_hours) * BigInt(3600 * 1000000000));

    const proposal = {
      id: uuidv4(),
      title,
      description,
      category,
      proposer,
      created_at: now,
      voting_start: votingStart,
      voting_end: votingEnd,
      status: "Draft",
      yes_votes: 0,
      no_votes: 0,
      abstain_votes: 0,
      total_votes: 0,
      quorum_required,
      execution_data: null
    };

    dataStore.proposals.set(proposal.id, proposal);
    
    // Emit real-time update
    const serializedProposals = Array.from(dataStore.proposals.values()).map(p => ({
      ...p,
      created_at: p.created_at.toString(),
      voting_start: p.voting_start.toString(),
      voting_end: p.voting_end.toString()
    }));
    io.to('proposals').emit('proposals_update', serializedProposals);
    
    const serializedProposal = {
      ...proposal,
      created_at: proposal.created_at.toString(),
      voting_start: proposal.voting_start.toString(),
      voting_end: proposal.voting_end.toString()
    };
    res.status(201).json(serializedProposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/proposals/:id/vote', (req, res) => {
  try {
    const { voter, vote_type, voting_power, reason } = req.body;
    const proposal = dataStore.proposals.get(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (vote_type === "Yes") {
      proposal.yes_votes += voting_power;
    } else if (vote_type === "No") {
      proposal.no_votes += voting_power;
    } else if (vote_type === "Abstain") {
      proposal.abstain_votes += voting_power;
    }

    proposal.total_votes += voting_power;
    
    // Emit real-time update
    const serializedProposals = Array.from(dataStore.proposals.values()).map(p => ({
      ...p,
      created_at: p.created_at.toString(),
      voting_start: p.voting_start.toString(),
      voting_end: p.voting_end.toString()
    }));
    io.to('proposals').emit('proposals_update', serializedProposals);
    
    const serializedProposal = {
      ...proposal,
      created_at: proposal.created_at.toString(),
      voting_start: proposal.voting_start.toString(),
      voting_end: proposal.voting_end.toString()
    };
    res.json(serializedProposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction Routes
app.get('/api/transactions', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = Array.from(dataStore.transactions.values())
      .sort((a, b) => Number(b.timestamp - a.timestamp))
      .slice(0, limit)
      .map(transaction => ({
        ...transaction,
        amount: transaction.amount.toString(),
        timestamp: transaction.timestamp.toString()
      }));
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transactions/policy/:policyId', (req, res) => {
  try {
    const transactions = Array.from(dataStore.transactions.values())
      .filter(t => t.policy_id === req.params.policyId)
      .map(transaction => ({
        ...transaction,
        amount: transaction.amount.toString(),
        timestamp: transaction.timestamp.toString()
      }));
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics Routes
app.get('/api/analytics/overview', (req, res) => {
  try {
    const totalPolicies = dataStore.policies.size;
    const activePolicies = Array.from(dataStore.policies.values()).filter(p => p.status === "Active").length;
    const totalComplaints = dataStore.complaints.size;
    const pendingComplaints = Array.from(dataStore.complaints.values()).filter(c => c.status === "Submitted").length;
    const totalProposals = dataStore.proposals.size;
    const activeProposals = Array.from(dataStore.proposals.values()).filter(p => p.status === "Active").length;
    const totalTransactions = dataStore.transactions.size;

    const totalFundsAllocated = Array.from(dataStore.policies.values())
      .reduce((sum, p) => sum + p.fund_allocation, 0n);
    const totalFundsReleased = Array.from(dataStore.policies.values())
      .reduce((sum, p) => sum + p.fund_released, 0n);

    res.json({
      totalPolicies,
      activePolicies,
      totalComplaints,
      pendingComplaints,
      totalProposals,
      activeProposals,
      totalTransactions,
      totalFundsAllocated: formatBigInt(totalFundsAllocated),
      totalFundsReleased: formatBigInt(totalFundsReleased),
      utilizationRate: totalFundsAllocated > 0n ? (Number(totalFundsReleased) / Number(totalFundsAllocated) * 100).toFixed(2) : "0.00"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 CivicLedger Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 WebSocket: ws://localhost:${PORT}`);
  console.log(`🏛️  CivicLedger = Trust through Transparency`);
}); 