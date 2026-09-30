# React Todo App (Vite + Tailwind CSS)

โปรเจกต์ React Todo App ที่สร้างด้วย Vite, Tailwind CSS และ Lucide Icons

## โครงสร้างโปรเจกต์
- `src/components/TodoApp.jsx` - คอมโพเนนต์หลักของ Todo App
- `src/App.jsx` - คอมโพเนนต์ Root
- `src/main.jsx` - จุดเริ่มต้นการรัน React
- `src/index.css` - ไฟล์รวม Tailwind Directives

## ขั้นตอนการติดตั้งและรันโปรเจกต์

1. แตกไฟล์ zip และเปิดโฟลเดอร์ใน VS Code หรือ Terminal:
   ```bash
   cd todo-app-vite
   ```

2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```

3. เริ่มต้นรันเซิร์ฟเวอร์สำหรับพัฒนา (Development Server):
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ URL ที่แสดงในคอนโซล (ปกติคือ http://localhost:5173/)

4. การ Build สำหรับขึ้น Production:
   ```bash
   npm run build
   ```
