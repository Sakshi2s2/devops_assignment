# Step 1: Use a Node.js base image
FROM node:16

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (if present)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Expose port (same as in your app)
EXPOSE 3000

# Step 7: Command to run your application
CMD ["npm", "run", "dev"]
