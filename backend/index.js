const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const QueueManager = require('./queue');
const kiosk = require('./model/kioskSchema');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('./config');

// Load environment variables from .env file
dotenv.config();

const customerSockets = {};
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Enable cookies
  },
});

const corsOptions = {
  origin: '*', // Replace with your frontend's URL
  methods: 'GET,POST,PUT,DELETE', // Allowed methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
  credentials: true, // Enable cookies
};

// socket
const emitTop10Customers = (kioskId) => {
  const top10 = QueueManager.getFirst10Tickets(kioskId);
  console.log('top10', top10);
  top10.forEach(customer => {
    const socket = customerSockets[customer.id];
    if (socket) {
      console.log('emitting to socket', socket.id);
      socket.emit('update-top-10', { kioskId, top10 });
    }
  });
};

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`);
  
  socket.on('add-customer', (code) => {
    const kioskId = code;
    QueueManager.createQueue(kioskId);
    const ticket = QueueManager.addCustomer(kioskId);
    ticket.kioskId = kioskId;
    customerSockets[ticket.id] = socket;
    socket.emit('registered-customer', ticket);
    emitTop10Customers(kioskId);
  });
 

  // Remove the socket connection when the customer disconnects
  socket.on('disconnect', () => {
    for (const customerId in customerSockets) {
      if (customerSockets[customerId] === socket) {
        delete customerSockets[customerId];
        break;
      }
    }
  });
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Middleware to ensure the queue exists for a kiosk
// app.use('/kiosk/:id', (req, res, next) => {
  
//   next();
// });

// Add a customer to the queue
app.post('/kiosk/:id/add-customer', (req, res) => {
  const kioskId = req.params.id;
  const ticket = QueueManager.addCustomer(kioskId);
  ticket.kioskId = kioskId;
  console.log('ticket', ticket);
  res.json(ticket);
  
});

// Get the next customer in the queue
// app.get('/kiosk/:id/next-customer', (req, res) => {
//   const kioskId = req.params.id;
//   const nextCustomer = QueueManager.getNextCustomer(kioskId);
//   if (nextCustomer) {
//     res.json(nextCustomer);
//     emitTop10Customers(kioskId);
//   } else {
//     res.status(404).json({ message: 'No customers in the queue' });
//   }
// });

// Remove expired tickets
app.delete('/kiosk/:id/remove-expired', (req, res) => {
  const kioskId = req.params.id;
  QueueManager.removeExpiredTickets(kioskId);
  res.json({ message: 'Expired tickets removed' });
  emitTop10Customers(kioskId);
});

// Get the first 10 tickets in the queue
app.get('/kiosk/:id/first-10-tickets', (req, res) => {
  const kioskId = req.params.id;
  const first10 = QueueManager.getFirst10Tickets(kioskId);
  res.json(first10);
  emitTop10Customers(kioskId);
});

// Remove a customer by ID
app.delete('/kiosk/:id/remove-customer/:customerId', (req, res) => {
  const kioskId = req.params.id;
  const customerId = req.params.customerId;
  const updatedQueue = QueueManager.removeCustomerById(kioskId, customerId);
  res.json(updatedQueue );
  emitTop10Customers(kioskId);
  const socket = customerSockets[customerId];
  socket.emit('customer-removed', { message: 'You have been removed from the queue' });
});

// to add the kiosks in the database
app.post('/kiosk', (req, res) => {
  const data = req.body;
  const newKiosk = new kiosk(data);
  newKiosk.save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error adding kiosk', error: err });
    });
});

// to get all the kiosks from the database 
app.get('/kiosk', (req, res) => {
  kiosk.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error getting kiosks', error: err });
    });
});

// to get a kiosk by id
app.get('/kiosk/:id', (req, res) => {
  const id = req.params.id;
  kiosk.findById(id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json({ message: 'Error getting kiosk', error: err });
    });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

