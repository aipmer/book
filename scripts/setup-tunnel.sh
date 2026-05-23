#!/bin/bash

# Codex Reverse Port Forwarding Tunnel Setup Helper

echo "============================================="
echo "⚙️  Codex Reverse Tunnel Setup Helper"
echo "============================================="
echo "This helper configures reverse tunnels to bridge your local resources"
echo "with Codex's cloud sandboxes (as covered in Ch.03)."
echo "============================================="

echo "Choose a tunnel provider:"
echo "1) SSH Reverse Port Forwarding (Requires your own VPS)"
echo "2) Ngrok (Fast, zero-config)"
read -p "Select option [1-2]: " option

if [ "$option" = "1" ]; then
    read -p "Enter your public VPS user & host (e.g. user@your-public-vps.com): " vps
    read -p "Enter VPS port to expose (default 54320): " vps_port
    vps_port=${vps_port:-54320}
    read -p "Enter local port to forward (default 5432): " local_port
    local_port=${local_port:-5432}

    echo ""
    echo "🚀 Run this command in your local host terminal:"
    echo "--------------------------------------------------"
    echo "ssh -R ${vps_port}:localhost:${local_port} ${vps} -N"
    echo "--------------------------------------------------"
    echo ""
    echo "🔒 In your Codex cloud sandbox, export this connection string:"
    echo "export DATABASE_URL=\"postgresql://postgres:password@your-public-vps.com:${vps_port}/dev_db\""

elif [ "$option" = "2" ]; then
    read -p "Enter local port to expose via Ngrok (default 5432): " local_port
    local_port=${local_port:-5432}

    echo ""
    echo "🚀 Run this command in your local host terminal:"
    echo "--------------------------------------------------"
    echo "ngrok tcp ${local_port}"
    echo "--------------------------------------------------"
    echo ""
    echo "🔒 Find the ngrok forwarding URL (e.g. tcp://0.tcp.ngrok.io:12345) and export:"
    echo "export DATABASE_URL=\"postgresql://postgres:password@0.tcp.ngrok.io:12345/dev_db\""
else
    echo "❌ Invalid option selected. Exiting."
    exit 1
fi
