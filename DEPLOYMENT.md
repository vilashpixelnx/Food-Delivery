# Production Deployment Guide 🌐

This guide contains everything you need to deploy the **Smart Pani Puri Cart Management System** to a Linux VPS (Ubuntu 22.04+).

## 1. Prerequisites
- A Linux VPS (DigitalOcean, AWS, Linode, etc.)
- A Domain Name pointing to your VPS IP
- Node.js (v18+) & NPM installed
- MongoDB (Atlas recommended or local installation)

---

## 2. Server Initial Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 globally
sudo npm install pm2 -g
```

---

## 3. Clone & Build
```bash
# Clone the repository
git clone <your-repo-url>
cd Food-Delivery

# Setup Backend
cd server
npm install
# Create .env file with production values
cp .env.example .env 
# Edit .env: nano .env

# Setup Frontend
cd ../client
npm install
npm run build # Generates the /dist folder
```

---

## 4. Nginx Configuration
Create a configuration file for your domain:
```bash
sudo nano /etc/nginx/sites-available/smartcart
```

**Configuration Content:**
```nginx
server {
    listen 80;
    server_name yourdomain.com; # Replace with your domain

    # Frontend (Built Files)
    location / {
        root /path/to/Food-Delivery/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API (Reverse Proxy)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/smartcart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 6. Start the Backend with PM2
```bash
cd /path/to/Food-Delivery
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 7. Post-Deployment Checklist
- [ ] Check if `MONGO_URI` is correctly set in production `.env`.
- [ ] Verify `RAZORPAY_KEY_ID` in frontend production environment.
- [ ] Ensure `VITE_API_BASE_URL` in frontend points to your domain/api.
- [ ] Test PDF download and Thermal Printing on live URL.
