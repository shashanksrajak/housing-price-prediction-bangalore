To deploy the server on a cloud server e.g. EC2 instance on AWS, follow these steps 
1. Clone this repo on the server
2. go to dir `server` in the repo
3. Try out the server is running as expected with these commands
`source venv/bin/activate` and `python server.py`
4. If the server is running fine, close it and create a systemd service to keep the server running even after you close the terminal

```sh
sudo vim /etc/systemd/system/blr_housing_price.service


-- put this content in this file
[Unit]
Description=blr-housing-price
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/blr-housing-price/server
ExecStart=/home/ubuntu/blr-housing-price/server/venv/bin/python /home/ubuntu/blr-housing-price/server/server.py
Restart=on-failure
StandardOutput=append:/var/log/myapp.log
StandardError=append:/var/log/myapp.log

[Install]
WantedBy=multi-user.target



-- use these commands to run and check status of service

sudo systemctl enable blr_housing_price.service

sudo systemctl start blr_housing_price.service

sudo systemctl status blr_housing_price.service

sudo journalctl -u blr_housing_price.service

```
