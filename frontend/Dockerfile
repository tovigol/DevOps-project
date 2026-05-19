# שלב 1: בניית האפליקציה
FROM node:20-alpine AS build

WORKDIR /app

# העתקת קבצי הגדרת החבילות
COPY package*.json ./

# התקנת התלויות (Dependencies)
RUN npm install

# העתקת שאר קבצי הפרויקט
COPY . .

# יצירת קובץ ה-Build הפרודקטיבי
RUN npm run build

# שלב 2: הגשת הקבצים הסטטיים באמצעות Nginx
FROM nginx:stable-alpine

# העתקת קבצי ה-Build מהשלב הקודם אל תיקיית ההגשה של Nginx
COPY --from=build /app/build /usr/share/nginx/html

# חשיפת פורט 80 עבור השרת
EXPOSE 80

# הפעלת שרת Nginx
CMD ["nginx", "-g", "daemon off;"]