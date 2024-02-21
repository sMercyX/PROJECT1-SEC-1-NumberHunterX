# ProjectSimpleJs1
First Project of Client side II
member
<ul>
<li>65130500017 ญาดา เจนรุ่งโรจน์สกุล 22%<ul>

- Core game function programming
  - Genarate Block
  - Hint System
  - Fix Bug Missing System
  - Timing System
  - Next level System
  - Random level System
  - local storage System
- Json Level (easy and hard)
- Attend weekly meeting
  
<li>65130500021 ณัฐวรรณ คุ้มเผ่า 18%<ul>

- Tutorail Page
- Guide design
- Block Template
- Hint System
- Win Page 
- Fails Page
- CSS
- Attend weekly meeting
  
<li>65130500029 ธิติพงศ์ สุดสวนศรี 18%<ul>

- Core game function programming 
  - Timing System
  - Next level System
  - Fix Bug Missing System
  - Hint System
- Json Level (easy)
- Tutorail Page
- Responsive
- Attend weekly meeting
</ul></li>
<li>65130500033 นภทีป์ จันทร์อินทร์ 19%<ul>
  - function 
    - timer
    - start button
    - next level
    - current level
    - missed
    - fail page
  </ul></li>
<li>65130500048 พสิษธ์ อุดมพานิช 23%<ul>
  
- project coordinator
- proof of concept
- bug fixes and correction
- code review
- Core game function programming 
  - Checking block
  - Marking block
  - Hinting System
  - Miss and Health bar
  - Winning checking system
- Attend weekly meeting
</ul></li>


</ul>

# Features list
### 1.Tutorials 
* multiple pages tutorial สามารถกดเปลี่ยนหน้า tutorial ได้
* มีปุ่มเปลี่ยนหมวดหมู่ของ tutorial สองปุ่ม: General, Game Modes

### 2.Game Play
#### Easy mode และ Hard mode
* เมื่อกดเริ่มเกม ระบบจะสุ่มเลือก object ด่านจาก level JSON file มา 5 level จาก level ทั้งหมดใน file แล้วนำค่ามาใส่ใน template เกม
* ผู้เล่นสามารถคลิกซ้ายในการเลือกช่อง (check) โดยจะแสดงเป็นสีเขียวถ้าเป็นblockที่ถูกและ สีแดงถ้าเป็นblockที่ผิดแล้วไปเพิ่มค่า missed
* ผู้เล่นสามารถกดคลิกขวาในกรณีที่ต้องการกด mark ไม่ให้กดคลิกซ้ายได้เป็นการกันช่อง คล้ายกับการตัด choice และสามารถกดคลิกขวาอีกครั้งเพื่อนำmarkออก
* มี Hint เป็นตัวช่วย(Easy mode 3 ครั้ง และHard mode 5 ครั้ง)ในแต่ละlevel โดยเมื่อผู้เล่นกดปุ่มHint 1 ครั้ง จะ ทำการrandom block ที่ถูก และเฉลยเป็นสีเขียวในblockนั้นให้ ในกรณีที่ผู้เล่นได้ mark ช่องที่ถูกต้องและเหลือเป็น block สุดท้ายปุ่ม mark จะไม่ถูก disable แสดงถึงยังมี block ที่ยังไม่ถูกกด เมื่อเล่นจบด่านนั่นคือ block ที่ถูกถูก check จนครบปุ่มนี้ก็จะถูกปิดไป
* มีเวลานับตั้งแต่เริ่มเล่นจนเล่นครบทั้ง 5 level
* มี Best time ที่เป็นเวลาที่ดีที่สุดของผู้เล่นเก็บไว้ในlocal storage ถ้าผู้เล่นเล่นในEasy mode จะถูกเก็บไว้ใน Localstorage item ชื่อ “easyMode” ถ้าผู้เล่นเล่นในHard mode จะถูกเก็บไว้ใน Localstorage item ชื่อ “hardMode” และแสดงในทุก level ที่เล่นขึ้นอยู่กับ mode ที่เล่น
* มีค่าMissในการระบุว่ากดblockที่ผิดไปกี่ครั้งแล้วตั้งแต่เริ่มเล่น โดยถ้าค่าMiss ของEasy levelเกิน5 ครั้ง และHard levelเกิน10ครั้งจะเข้าสู่ modal แพ้เกม

### 3.Modal Page
* เมื่อผู้เล่น เล่นครบทั้ง 5 level หน้า modal page จะแสดงขึ้นมา เพื่อระบุBest time และ เวลาที่ใช้ทั้งหมดในการเล่น โดยจะมีข้อความแตกต่างกันไปในแต่ละกรณีเช่น หากเวลาเล่นเร็วกว่า Best time จะแสดงความยินดีต่อผู้เล่น หรือ หากช้ากว่าหรือเท่ากับ best time จะมีข้อความบอกให้ผู้เล่นเพิ่มความเร็ว

### 4.Fail page
* เมื่อค่าMiss ของEasy levelเกิน5 ครั้ง และHard levelเกิน10ครั้ง Fail page จะแสดงขึ้นมา ให้เลือกเริ่มเล่นอีกครั้ง หรือกลับไปหน้าHome
  
# Instruction Manual
Number Hunter เป็นเกมปริศนาเชิงตรรกะ ที่ให้ผู้เล่นทดสอบทักษะของตนด้วยการไขปริศนาที่เกี่ยวข้องกับการเติมเซลล์บนตารางตามคำใบ้ที่บอกด้วยตัวเลขสำหรับแต่ละแถวและคอลลัมน์เพื่อให้ได้รูปภาพที่เกมกำหนด
### ขั้นตอนการเริ่ม
เมื่อผู้เล่นอยู่ที่หน้าแรก จะสามารถเลือกการเข้าถึงเกมในโหมดง่าย(easy mode) โหมดยาก(hard mode) หรือเกี่ยวกับการสอน(tutorial)ได้
### tutorial
เมื่อเข้ามาที่หน้าเกี่ยวกับการสอน ผู้เล่นจะพบกับการสอนพื้นฐานที่จะแนะนำวิธีการเล่นและหลักการทั่วไปของเกม และการแนะนำตามโหมด ด้วยการกดปุ่มGame mode ผู้เล่นสามารถกลับไปดูการสอนพื้นฐานได้อีกครั้งด้วยการกดปุ่ม general 
### ระดับความยาก
ผู้เล่นสามารถเลือกระดับความยากได้ที่หน้าแรก โดยจะมีให้เลือก2โหมด คือโหมดง่าย(easy mode)และโหมดยาก(hard mode) ในแต่ละโหมดผู้เล่นจะต้องผ่านด่านทั้งหมด5ครั้งถึงจะจบเกม
### How to play
- ในแต่ละแถวและคอลลัมน์จะมีตัวเลขกำหนดไว้ ซึ่งตัวจะเป็นตัวกำหนดว่าผู้เล่นจะต้องเติมเซลล์ในตารางเป็นจำนวนเท่าไหร่
- เมื่อมีตัวเลขหลายตัวถัดจากแถวหรือคอลลัมน์ ตัวเลขเหล่านั้นแสดงถึงกลุ่มของช่องที่มีจำนวนต่างกัน สิ่งสำคัญคือต้องมีช่องว่างอย่างน้อยหนึ่งช่องระหว่างกลุ่มเหล่านี้
- วิธีการเติมเซลล์ในตาราง ให้ผู้เล่นทำการคลิกซ้ายไปที่ช่องที่ต้องการ ถ้าเป็นช่องที่ถูกต้องเซลล์จะกลายเป็นสีเขียว แต่เมื่อเป็นช่องที่ผิด เซลล์จะกลายเป็นสีแดง นอกจากนี้ผู้เล่นยังสามารถบล็อกเซลล์ที่คิดว่าไม่ใช่ด้วยการคลิกขวาไปยังช่องที่ต้องการ และสามารถยกเลิกการบล็อกนั้นด้วยการคลิกขวาซ้ำในช่องเดิม
- ในแต่ละด่านผู้เล่นสามารถกดปุ่ม hint เพื่อรับคำใบ้เพิ่มจากเกม โดยเป็นการเติมเซลล์ในช่อง ในโหมดง่ายเป็นจำนวน 3 ครั้งและในโหมดยากเป็นจำนวน 5 ครั้ง
- ในแต่ละโหมดจะมีกำหนดจำนวนครั้งที่ผิดพลาด โดยในโหมดง่ายเป็นจำนวนไม่เกิน 5 ครั้งและในโหมดยากเป็นจำนวนไม่เกิน 10 ครั้ง เมื่อผู้เล่นพลาดเกินที่เกมกำหนด จะต้องเริ่มต้นเกมใหม่ทั้งหมด
- ทั้ง2โหมดจะมีการจับเวลาตั้งแต่ด่านที่1ถึงด่านที่5 เพื่อนำไปสร้างสถิติการเล่นของผู้เล่นหากผู้เล่นทำได้เร็วกว่าเวลาในรอบก่อนหน้าจะเก็บเป็นสถิติเวลาที่ดีที่สุด


## คลิปสาธิต features
https://mailkmuttacth-my.sharepoint.com/personal/pasit_udom_kmutt_ac_th/_layouts/15/stream.aspx?id=%2Fpersonal%2Fpasit%5Fudom%5Fkmutt%5Fac%5Fth%2FDocuments%2F%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9A%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B6%E0%B8%81%2FClient%20side%20project%201%2D20240217%5F233847%2D%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9A%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B6%E0%B8%81%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B8%E0%B8%A1%2Emp4&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&ga=1&referrer=StreamWebApp%2EWeb&referrerScenario=AddressBarCopied%2Eview


## แหล่งอ้างอิง
1. ภาพรวม https://tailwindcss.com/docs/installation
2. ภาพรวม https://vuejs.org/guide/introduction.html




