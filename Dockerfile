FROM node:latest

WORKDIR /app
# Copy the package.json to workdir
COPY package.json ./

# Run npm install - install the npm dependencies
RUN npm install

RUN npm install -g pm2

# Copy application source
COPY . .

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 3000

# Start the application
CMD ["pm2-runtime", "app.js"]