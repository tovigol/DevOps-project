# שימוש בתמונת פייתון קלה ומאובטחת
FROM python:3.11-alpine

# הגדרת תיקיית העבודה בתוך הקונטיינר
WORKDIR /app

# העתקת קובץ הדרישות (במידה וקיים) והתקנת החבילות
# הערה: אם יש לך קובץ requirements.txt, הסירי את ה-# מהשורות הבאות:
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# העתקת קוד המקור (כולל app.py) לתוך הקונטיינר
COPY . .

# חשיפת הפורט עליו רצה האפליקציה (למשל 5000 עבור Flask)
# שנו את הפורט בהתאם למה שמוגדר בתוך app.py שלכן
EXPOSE 5000

# פקודת ההרצה של האפליקציה
CMD ["python", "app.py"]