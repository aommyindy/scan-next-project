# Gencode - Next.js Project Analyzer

## 📌 จุดประสงค์
Gencode ถูกพัฒนาขึ้นเพื่อช่วย **สแกนโครงสร้างของโปรเจค Next.js** และ **สร้าง Prompt อัตโนมัติ** สำหรับ AI ช่วยในการพัฒนาโค้ดอย่างมีประสิทธิภาพ โดยจะตรวจจับองค์ประกอบสำคัญของโปรเจค เช่น:

- **State Management** (Redux, Recoil, Zustand, MobX, Context API)
- **CSS Frameworks** (Tailwind, Styled Components, MUI, Bootstrap, DaisyUI ฯลฯ)
- **การตั้งค่า Next.js** (ตรวจจับ App Router / Page Router, API Routes, Config Files เช่น `next.config.js`, `.env`)
- **ธีมและสไตล์** (เช่น `theme.ts`, `tailwind.config.js`)
- **โครงสร้างโค้ด** (Components, Hooks, Utils, Styles)

### เหมาะกับใคร?
✅ นักพัฒนา Next.js ที่ต้องการทำความเข้าใจโครงสร้างโปรเจคได้อย่างรวดเร็ว  
✅ ผู้ที่ต้องการสร้าง AI Prompt สำหรับ **Auto Code Generation** อย่างแม่นยำ  
✅ ทีมงานที่ต้องการมาตรฐานในการจัดการโครงสร้างโปรเจค Next.js  

---

## 🚀 การติดตั้ง

### 1️⃣ **ติดตั้งผ่าน NPM**
```sh
npm install -g gencode-next
```

### 2️⃣ **ติดตั้งผ่าน Yarn**
```sh
yarn global add gencode-next
```

---

## ⚡ การใช้งาน

### 🔍 **สแกนโปรเจค Next.js และสร้าง Prompt**
```sh
scan-next /path/to/your/project
```
หรือหากต้องการสแกนโปรเจคที่อยู่ใน **โฟลเดอร์ปัจจุบัน**:
```sh
scan-next .
```

✅ เมื่อคำสั่งทำงานสำเร็จ ไฟล์ Prompt จะถูกสร้างที่:  
```
.continue/prompts/gencode.prompt
```

---

## 🛠️ การตั้งค่าเพิ่มเติม

### 🔧 **กำหนดเส้นทางของไฟล์ Output**
คุณสามารถกำหนดที่อยู่ของไฟล์ Prompt ที่สร้างขึ้นเองได้โดยเพิ่ม `--output` เช่น:
```sh
scan-next . --output=my_prompts/output.prompt
```

### ⚙ **การใช้งานในระบบ CI/CD**
หากต้องการรวมเข้ากับ **CI/CD Pipeline** ให้เพิ่มคำสั่งนี้เข้าไปในสคริปต์:
```sh
scan-next . --output=ci_prompts/gencode.prompt
```
แล้วนำไฟล์ที่สร้างไปใช้ในการพัฒนาโค้ดอัตโนมัติ!

---

## 📜 License
Gencode อยู่ภายใต้ [MIT License](LICENSE)

---

💡 **พัฒนาโดย:** ทีมงานที่ต้องการให้การจัดการโครงสร้าง Next.js เป็นเรื่องง่ายขึ้น 🎯