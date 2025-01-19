import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Send } from 'lucide-react';

export default function MessageForm() {
  const [formData, setFormData] = useState({
    sender_name: '',
    religion: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([formData]);

      if (error) throw error;

      setFormData({ sender_name: '', religion: '', message: '' });
      alert('تم إرسال رسالتك بنجاح');
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء إرسال رسالتك');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">ابعث رسالة</h1>
        <p className="text-center text-[hsl(var(--muted-foreground))] mb-8">
          اكتب وأرسل رسالتك من هنا
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="sender_name" className="block text-lg">
              اسم الغالي
            </label>
            <input
              type="text"
              id="sender_name"
              value={formData.sender_name}
              onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
              className="w-full p-4 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--foreground))] transition-shadow"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="religion" className="block text-lg">
              اعتقادك / ديانتك
            </label>
            <select
              id="religion"
              value={formData.religion}
              onChange={(e) => setFormData(prev => ({ ...prev, religion: e.target.value }))}
              className="w-full p-4 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--foreground))] transition-shadow appearance-none"
              required
            >
              <option value="">اختر...</option>
              <option value="islam">الإسلام</option>
              <option value="christianity">النصرانية</option>
              <option value="judaism">اليهودية</option>
              <option value="other">آخر</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-lg">
              سؤالك
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-4 rounded-2xl bg-[hsl(var(--muted))] border border-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--foreground))] transition-shadow min-h-[200px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-2xl font-bold text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? 'جاري الإرسال...' : (
              <>
                ابعث
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}