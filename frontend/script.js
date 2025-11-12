const API_BASE = 'http://localhost:3000/api';

async function fetchDevices() {
    try {
        const response = await fetch(`${API_BASE}/devices`);
        const devices = await response.json();
        displayDevices(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
    }
}

function displayDevices(devices) {
    const container = document.getElementById('devices-container');
    container.innerHTML = '';

    devices.forEach(device => {
        const deviceElement = createDeviceElement(device);
        container.appendChild(deviceElement);
    });
}

function createDeviceElement(device) {
    const div = document.createElement('div');
    div.className = 'bg-glass backdrop-blur-md p-6 rounded-lg border border-gray-700 hover:border-cyber transition duration-300';
    div.innerHTML = `
        <h3 class="text-xl font-semibold mb-2">${device.name}</h3>
        <p class="text-gray-300 mb-4">Type: ${device.type}</p>
        <div class="flex items-center justify-between">
            <span class="text-sm">Status: <span id="status-${device.id}" class="${device.status === 'on' || device.status === 'locked' || device.status === 'recording' ? 'text-cyber' : 'text-red-400'}">${device.status}</span></span>
            <label class="flex items-center cursor-pointer">
                <input type="checkbox" id="toggle-${device.id}" class="sr-only" ${device.status === 'on' || device.status === 'locked' || device.status === 'recording' ? 'checked' : ''} onchange="toggleDevice(${device.id})">
                <div class="w-12 h-6 bg-gray-300 rounded-full shadow-inner transition-colors duration-300"></div>
                <div class="dot absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300"></div>
                <span class="ml-4">${device.name}</span>
            </label>
        </div>
        ${device.temperature ? `<p class="text-sm mt-2">Temperature: ${device.temperature}°C</p>` : ''}
    `;
    return div;
}

async function toggleDevice(id) {
    try {
        const response = await fetch(`${API_BASE}/devices/${id}`);
        const device = await response.json();

        const newStatus = device.status === 'on' || device.status === 'locked' || device.status === 'recording' ? 'off' : 'on';

        await fetch(`${API_BASE}/devices/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        // Update toggle switch appearance
        const toggle = document.getElementById(`toggle-${id}`);
        const toggleBg = toggle.nextElementSibling;
        const dot = toggleBg.nextElementSibling;

        if (newStatus === 'on' || newStatus === 'locked' || newStatus === 'recording') {
            toggle.checked = true;
            toggleBg.classList.add('bg-cyber');
            toggleBg.classList.remove('bg-gray-300');
            dot.classList.add('translate-x-6');
        } else {
            toggle.checked = false;
            toggleBg.classList.remove('bg-cyber');
            toggleBg.classList.add('bg-gray-300');
            dot.classList.remove('translate-x-6');
        }

        fetchDevices();
    } catch (error) {
        console.error('Error toggling device:', error);
    }
}

// Initialize toggle switches on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
            const toggleBg = toggle.nextElementSibling;
            const dot = toggleBg.nextElementSibling;

            if (toggle.checked) {
                toggleBg.classList.add('bg-cyber');
                toggleBg.classList.remove('bg-gray-300');
                dot.classList.add('translate-x-6');
            } else {
                toggleBg.classList.remove('bg-cyber');
                toggleBg.classList.add('bg-gray-300');
                dot.classList.remove('translate-x-6');
            }
        });
    }, 100);
});

// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Load devices when page loads
document.addEventListener('DOMContentLoaded', fetchDevices);