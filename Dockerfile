FROM "node:12.4.0-alpine"

WORKDIR /app

COPY . /app
RUN ["npm", "install"]

EXPOSE 3282
EXPOSE 8887
EXPOSE 58433
EXPOSE 5000
EXPOSE 80
CMD ["npm", "start"]
