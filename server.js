const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock smart home data
let devices = [
    { id: 1, name: 'Living Room Light', type: 'light', status: 'off' },
    { id: 2, name: 'Kitchen Thermostat', type: 'thermostat', status: 'on', temperature: 22 },
    { id: 3, name: 'Front Door Lock', type: 'lock', status: 'locked' },
    { id: 4, name: 'Security Camera', type: 'camera', status: 'recording' },
];

// Routes
app.get('/api/devices', (req, res) => {
    res.json(devices);
});

app.get('/api/devices/:id', (req, res) => {
    const device = devices.find(d => d.id === parseInt(req.params.id));
    if (!device) return res.status(404).json({ message: 'Device not found' });
    res.json(device);
});

app.put('/api/devices/:id', (req, res) => {
    const device = devices.find(d => d.id === parseInt(req.params.id));
    if (!device) return res.status(404).json({ message: 'Device not found' });

    Object.assign(device, req.body);
    res.json(device);
});

app.post('/api/devices', (req, res) => {
    const newDevice = {
        id: devices.length + 1,
        ...req.body
    };
    devices.push(newDevice);
    res.status(201).json(newDevice);
});

app.delete('/api/devices/:id', (req, res) => {
    const index = devices.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Device not found' });

    devices.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});