# Sử dụng Node.js phiên bản 18 làm base image
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt tất cả dependencies
RUN npm install

# Copy toàn bộ mã nguồn từ thư mục hiện tại vào trong container
COPY . .

# Expose port mà API Gateway sẽ chạy trên container
EXPOSE 3000

# Lệnh để chạy API Gateway
CMD ["node", "index.js"]
