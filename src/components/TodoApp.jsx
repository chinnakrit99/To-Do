import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Edit3, 
  X,
  ListTodo,
  Calendar,
  Tag,
  Search,
  PieChart,
  Briefcase,
  User,
  ShoppingCart,
  HeartPulse,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function TodoApp() {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // React State only - no localStorage
  const [todos, setTodos] = useState([
    {
      id: 1,
      text: 'ทบทวนเนื้อหาเตรียมสอบวิศวกรรมคอมพิวเตอร์',
      completed: false,
      priority: 'high',
      category: 'Work',
      dueDate: getTodayStr(),
    },
    {
      id: 2,
      text: 'ส่งรายงานสรุปผลการทดลอง Lab 11 Cloudflare Pages',
      completed: false,
      priority: 'medium',
      category: 'Work',
      dueDate: '2026-10-05',
    },
    {
      id: 3,
      text: 'ซื้ออุปกรณ์และลูกเปตองใหม่',
      completed: true,
      priority: 'low',
      category: 'Shopping',
      dueDate: '2026-09-28',
    },
    {
      id: 4,
      text: 'วิ่งออกกำลังกาย 30 นาทีและยืดกล้ามเนื้อ',
      completed: false,
      priority: 'medium',
      category: 'Health',
      dueDate: getTodayStr(),
    },
  ]);

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Configurations
  const priorityConfig = {
    high: { label: 'ด่วนมาก', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    medium: { label: 'ปานกลาง', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    low: { label: 'ทั่วไป', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  };

  const categories = [
    { id: 'Work', label: 'งาน/เรียน', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'Personal', label: 'ส่วนตัว', icon: User, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'Shopping', label: 'ซื้อของ', icon: ShoppingCart, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'Health', label: 'สุขภาพ', icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  // Actions
  const handleAddTodo = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      priority,
      category,
      dueDate: dueDate || '',
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    setDueDate('');
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

  // Due Date status checker
  const getDueDateStatus = (dateStr) => {
    if (!dateStr) return null;
    const today = getTodayStr();
    if (dateStr === today) {
      return { status: 'today', label: 'วันนี้', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (dateStr < today) {
      return { status: 'overdue', label: 'เลยกำหนด', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    return { status: 'future', label: dateStr, color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  // Calculations for Stats
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const remainingCount = totalCount - completedCount;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered List
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (selectedCategory !== 'all' && todo.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = todo.text.toLowerCase().includes(q);
      const matchCategory = todo.category.toLowerCase().includes(q);
      if (!matchText && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Header & Stats Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LAB 11 Part 2 — React To-Do Project</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <ListTodo className="w-8 h-8 text-indigo-600" />
              To-Do Application
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              สร้างเว็บด้วย React + Tailwind CSS และเชื่อมต่อ Cloudflare Pages
            </p>
          </div>

          {/* Quick Statistics Donut & Counters */}
          <div className="flex items-center gap-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            {/* Donut representation */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600 transition-all duration-500"
                  strokeDasharray={`${percentCompleted}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-700">{percentCompleted}%</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                <span className="text-slate-600 font-medium">เหลืออีก: <b>{remainingCount}</b> งาน</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-600 font-medium">เสร็จแล้ว: <b>{completedCount}</b> / {totalCount} งาน</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="เพิ่มรายการใหม่ที่ต้องทำ... (กด Enter เพื่อบันทึก)"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm sm:text-base px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Due Date Picker */}
              <div className="relative sm:w-48">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  title="กำหนดวันส่ง (Due Date)"
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-700 text-xs sm:text-sm px-3.5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-sm shadow-indigo-200 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>เพิ่มรายการ</span>
              </button>
            </div>

            {/* Selectors: Category & Priority */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs sm:text-sm">
              {/* Category selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">หมวดหมู่:</span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? `${cat.color} ring-2 ring-indigo-500/20 shadow-xs`
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority selector */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">ความสำคัญ:</span>
                <div className="flex gap-1.5">
                  {(['low', 'medium', 'high']).map((p) => {
                    const cfg = priorityConfig[p];
                    const isSelected = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${
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
            </div>
          </form>
        </div>

        {/* Filter, Real-time Search & Category Tabs */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Realtime Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหารายการงานแบบ Real-time..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-200/70 rounded-2xl border border-slate-200 text-xs font-medium self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ทั้งหมด ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
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
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  filter === 'completed'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                เสร็จแล้ว ({completedCount})
              </button>
            </div>
          </div>

          {/* Category Filter Pills with counts */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full border transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-white border-slate-800 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ทุกหมวดหมู่ ({totalCount})
              </button>
              {categories.map((cat) => {
                const count = todos.filter((t) => t.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                      isSelected
                        ? `${cat.color} font-semibold ring-2 ring-indigo-500/20`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={clearCompleted}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline transition-colors self-end"
              >
                ล้างงานที่เสร็จแล้วทั้งหมด ({completedCount})
              </button>
            )}
          </div>
        </div>

        {/* Todo Items List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-300">
                <ListTodo className="w-7 h-7" />
              </div>
              <p className="text-slate-600 font-medium text-base">ไม่พบรายการงานที่ตรงกับเงื่อนไข</p>
              <p className="text-slate-400 text-xs mt-1">ลองเปลี่ยนคำค้นหา หรือสลับแท็บหมวดหมู่ดูนะครับ</p>
            </div>
          ) : (
            filteredTodos.map((todo) => {
              const cfg = priorityConfig[todo.priority] || priorityConfig.medium;
              const catObj = categories.find((c) => c.id === todo.category) || categories[0];
              const dueInfo = getDueDateStatus(todo.dueDate);
              const isEditing = editingId === todo.id;

              return (
                <div
                  key={todo.id}
                  className={`group relative bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-xs hover:shadow-md flex items-center gap-4 ${
                    todo.completed
                      ? 'border-slate-200/60 bg-slate-50/50'
                      : 'border-slate-200 hover:border-indigo-300'
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
                      <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-indigo-500 transition-colors bg-white" />
                    )}
                  </button>

                  {/* Todo Main Content */}
                  <div className="flex-1 min-w-0 space-y-1">
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
                          className="w-full text-sm sm:text-base font-normal bg-indigo-50/50 text-slate-800 border border-indigo-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                              : 'text-slate-800 font-medium'
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                    )}

                    {/* Metadata Badges (Category & Due Date) */}
                    {!isEditing && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                        {/* Category tag */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border font-medium ${catObj.color}`}>
                          <catObj.icon className="w-3 h-3" />
                          {catObj.label}
                        </span>

                        {/* Due Date Badge (Yellow for today, Red for overdue) */}
                        {dueInfo && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-semibold ${dueInfo.color}`}>
                            {dueInfo.status === 'overdue' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                            {dueInfo.status === 'today' && <Clock className="w-3 h-3 text-amber-600" />}
                            {dueInfo.status === 'future' && <Calendar className="w-3 h-3 text-slate-400" />}
                            {dueInfo.label}
                          </span>
                        )}
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

                  {/* Actions (Edit / Delete) */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => startEditing(todo)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        title="แก้ไข (หรือดับเบิ้ลคลิกที่ข้อความ)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 pt-2">
          <span>💡 ดับเบิ้ลคลิกเพื่อแก้ไขรายการ | จัดเก็บข้อมูลบน React State ตามเงื่อนไข LAB 11 Part 2</span>
        </div>

      </div>
    </div>
  );
}
