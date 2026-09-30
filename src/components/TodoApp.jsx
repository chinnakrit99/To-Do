import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Square, 
  CheckSquare, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  Edit3, 
  X,
  ListTodo
} from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'ทบทวนเนื้อหาเตรียมสอบวิศวกรรมคอมพิวเตอร์', completed: false, priority: 'high' },
    { id: 2, text: 'ส่งรายงานสรุปผลการทดลอง Lab 11', completed: false, priority: 'medium' },
    { id: 3, text: 'ฝึกซ้อมเปตองช่วงเย็น', completed: true, priority: 'low' },
  ]);

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const priorityConfig = {
    high: {
      label: 'ด่วนมาก',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    medium: {
      label: 'ปานกลาง',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    low: {
      label: 'ทั่วไป',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
  };

  const handleAddTodo = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      priority,
    };

    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEditing = () => {
    if (editingId === null) return;
    if (editingText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
        )
      );
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 flex justify-center items-start">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workshop 2: React Todo App</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2.5">
              <ListTodo className="w-8 h-8 text-indigo-600" />
              รายการสิ่งที่ต้องทำ
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              จัดการงานประจำวันของคุณอย่างเป็นระเบียบและรวดเร็ว
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-center sm:justify-end gap-3 self-center sm:self-auto">
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600 leading-none">{remainingCount}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">งานที่คงเหลือ</div>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="text-left">
              <div className="text-2xl font-bold text-emerald-600 leading-none">{completedCount}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">เสร็จสิ้นแล้ว</div>
            </div>
          </div>
        </div>

        {/* Add Todo Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 mb-6 transition-all hover:shadow-md">
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="เพิ่มรายการใหม่ที่ต้องทำ... (กด Enter เพื่อบันทึก)"
                className="flex-1 bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-sm shadow-indigo-200 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">เพิ่มรายการ</span>
              </button>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <span>เลือกระดับความสำคัญ:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['low', 'medium', 'high']).map((p) => {
                  const cfg = priorityConfig[p];
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        isSelected
                          ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-indigo-500/20 shadow-xs`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Controls: Filter Tabs & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="inline-flex p-1 bg-slate-200/60 rounded-xl border border-slate-200 text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({todos.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filter === 'active'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ที่ต้องทำ ({remainingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filter === 'completed'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เสร็จแล้ว ({completedCount})
            </button>
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline self-end sm:self-auto transition-colors"
            >
              ล้างรายการที่เสร็จแล้ว ({completedCount})
            </button>
          )}
        </div>

        {/* Todo List */}
        <div className="space-y-2.5">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-300">
                <ListTodo className="w-6 h-6" />
              </div>
              <p className="text-slate-600 font-medium text-sm">ไม่พบรายการงานในหมวดหมู่นี้</p>
              <p className="text-slate-400 text-xs mt-1">
                {filter === 'completed'
                  ? 'ยังไม่มีงานที่ทำเสร็จแล้ว'
                  : filter === 'active'
                  ? 'ยินดีด้วย! คุณเคลียร์งานหมดแล้ว'
                  : 'เริ่มต้นเพิ่มรายการแรกของคุณได้เลย'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => {
              const cfg = priorityConfig[todo.priority] || priorityConfig.medium;
              const isEditing = editingId === todo.id;

              return (
                <div
                  key={todo.id}
                  className={`group relative bg-white rounded-xl p-4 border transition-all duration-200 shadow-xs hover:shadow-md flex items-center gap-3.5 ${
                    todo.completed
                      ? 'border-slate-200/60 bg-slate-50/50'
                      : 'border-slate-200/90 hover:border-indigo-200'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleComplete(todo.id)}
                    className="flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                    aria-label={todo.completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
                  >
                    {todo.completed ? (
                      <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-indigo-500 transition-colors bg-white" />
                    )}
                  </button>

                  {/* Todo Content or Inline Edit Input */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          onBlur={saveEditing}
                          className="w-full text-sm sm:text-base font-normal bg-indigo-50/40 text-slate-800 border border-indigo-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button
                          type="button"
                          onClick={saveEditing}
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                          title="บันทึก"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="p-1 text-slate-400 hover:text-slate-600"
                          title="ยกเลิก"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDoubleClick={() => startEditing(todo)}
                        title="ดับเบิ้ลคลิกเพื่อแก้ไขข้อความ"
                        className="cursor-pointer select-none"
                      >
                        <span
                          className={`text-sm sm:text-base transition-all break-words ${
                            todo.completed
                              ? 'line-through text-slate-400 font-normal'
                              : 'text-slate-700 font-medium'
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Priority Badge */}
                  {!isEditing && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  )}

                  {/* Action Buttons: Edit / Delete */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => startEditing(todo)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="แก้ไข (หรือดับเบิ้ลคลิกที่ข้อความ)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer tip */}
        <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>💡 ทิป: ดับเบิ้ลคลิกที่ข้อความเพื่อแก้ไข หรือกด Enter ตอนพิมพ์เพื่อบันทึก</span>
        </div>
      </div>
    </div>
  );
}
