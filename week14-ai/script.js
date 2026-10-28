// ========================================
// To-Do List + Local Storage
// ต่อยอดจาก Lab 13 (Profile Card + To-Do)
// ========================================

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const remainNum = document.getElementById('remain-num');
const doneNum = document.getElementById('done-num');

// คีย์สำหรับเก็บข้อมูลใน Local Storage
const STORAGE_KEY = 'todoList.week14-ai';

// รายการเริ่มต้น (ใช้เมื่อไม่มีข้อมูลเดิมใน Local Storage)
const initialTodos = ['ซักผ้า', 'ทำ PSCP', 'เตรียมตัวสอบ', 'อ่านหนังสือ'];

// ---------- นับจำนวนงานที่เหลือ / เสร็จแล้ว ----------
function updateCount(){
  const items = list.querySelectorAll('.todo-item');
  const done = list.querySelectorAll('.todo-item.done').length;
  remainNum.textContent = items.length - done;
  doneNum.textContent = done;
}

// ---------- บันทึกรายการลง Local Storage ----------
function saveTodos(){
  const items = [];
  list.querySelectorAll('.todo-item').forEach((li) => {
    items.push({
      text: li.querySelector('.todo-text').textContent,
      done: li.classList.contains('done'),
    });
  });
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }catch(e){
    // เช่น Local Storage เต็มหรืออยู่ในโหมดไม่ระบุตัวตน ให้ทำงานต่อได้
    console.warn('บันทึกลง Local Storage ไม่สำเร็จ:', e);
  }
}

// ---------- โหลดรายการจาก Local Storage ----------
// คืนค่า null เมื่อไม่มีข้อมูลเดิม (หรือข้อมูลพัง) → จะใช้รายการเริ่มต้นแทน
function loadTodos(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw === null) return null;
    const data = JSON.parse(raw);
    if(!Array.isArray(data)) return null;
    // คัดเฉพาะรายการที่รูปแบบถูกต้อง
    const items = [];
    data.forEach((t) => {
      if(t && typeof t.text === 'string' && t.text.trim()){
        items.push({ text: t.text.trim(), done: t.done === true });
      }
    });
    return items;
  }catch(e){
    return null;
  }
}

// ---------- สร้างรายการ 1 ชิ้น ----------
function createItem(text, done = false){
  const li = document.createElement('li');
  li.className = 'todo-item';
  if(done) li.classList.add('done'); // คงสถานะ "เสร็จแล้ว" ตอนโหลดจาก Local Storage

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'todo-check';
  check.checked = done;

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = text;

  const del = document.createElement('button');
  del.className = 'delete-btn';
  del.type = 'button';
  del.textContent = 'ลบ';

  // ติ๊ก = เสร็จแล้ว
  check.addEventListener('change', () => {
    li.classList.toggle('done', check.checked);
    updateCount();
    saveTodos(); // บันทึกสถานะล่าสุดลง Local Storage ด้วย
  });

  // ลบเฉพาะรายการ (li) ที่ปุ่มนี้อยู่เท่านั้น
  del.addEventListener('click', () => {
    li.remove();
    updateCount();
    saveTodos(); // บันทึกทุกครั้งที่ลบ
  });

  li.append(check, span, del);
  return li;
}

// ---------- เพิ่มรายการใหม่ ----------
function addTodo(text, done = false){
  text = text.trim();
  if(!text) return;
  list.appendChild(createItem(text, done));
  updateCount();
  saveTodos(); // บันทึกทุกครั้งที่เพิ่ม
}

// ---------- เมื่อกดปุ่ม "+ เพิ่ม" ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = ''; // ล้างช่องกรอกหลังเพิ่ม
  input.focus();
});

// ---------- โหลดรายการตอนเปิด/รีเฟรชหน้าเว็บ ----------
const savedTodos = loadTodos();
if(savedTodos){
  // มีข้อมูลเดิมใน Local Storage → แสดงตามที่บันทึกไว้
  savedTodos.forEach((t) => list.appendChild(createItem(t.text, t.done)));
}else{
  // ไม่มีข้อมูลเดิม → ใช้รายการเริ่มต้น แล้วบันทึกลง Local Storage
  initialTodos.forEach((text) => addTodo(text));
}
updateCount();
