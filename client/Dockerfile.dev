FROM node:18

WORKDIR /kairos/client

# Copy only package.json and package-lock.json
COPY package*.json .
# RUN echo "kahlil" >> ouput.txt
#RUN pwd > build_info.txt
# Print the content of the package.json
#RUN cat package.json >> build_info.txt
# Install dependencies
RUN npm install


# Copy the rest of the application
# if you find the copy commented out that means that we're using volumes mounting to simulate prod env
COPY . .


EXPOSE 3000