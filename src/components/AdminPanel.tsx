import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, CheckCircle, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  sender_name: string;
  religion: string;
  message: string;
  note: string;
  read: boolean;
  created_at: string;
}

export default function AdminPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchMessages();
    
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchMessages)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: !currentRead })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: !currentRead } : msg
      ));
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const updateNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ note: noteText })
        .eq('id', id);

      if (error) throw error;
      
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, note: noteText } : msg
      ));
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">لوحة التحكم</h1>
      
      <div className="grid gap-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
              message.read
                ? 'bg-[hsl(var(--muted))] border-[hsl(var(--muted-foreground))] opacity-80'
                : 'bg-[hsl(var(--background))] border-[hsl(var(--foreground))] shadow-lg shadow-[hsl(var(--foreground))/10]'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{message.sender_name}</h3>
                  <p className="text-[hsl(var(--muted-foreground))]">{message.religion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRead(message.id, message.read)}
                    className="p-2 hover:text-[hsl(var(--muted-foreground))] transition-colors rounded-full hover:bg-[hsl(var(--muted))]"
                    title={message.read ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
                  >
                    <CheckCircle className={`h-5 w-5 ${message.read ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="p-2 hover:text-red-500 transition-colors rounded-full hover:bg-red-500/10"
                    title="حذف"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="bg-[hsl(var(--muted))] rounded-xl p-4 mb-4">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 mt-1 flex-shrink-0" />
                  <p className="text-lg whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
              
              {editingNote === message.id ? (
                <div className="mt-4">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--foreground))] min-h-[100px]"
                    placeholder="أضف ملاحظة..."
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setEditingNote(null)}
                      className="px-4 py-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => updateNote(message.id)}
                      className="px-4 py-2 rounded-lg bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:opacity-90 transition-opacity"
                    >
                      حفظ
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    setEditingNote(message.id);
                    setNoteText(message.note || '');
                  }}
                  className="mt-4 p-3 rounded-xl bg-[hsl(var(--muted))] cursor-pointer hover:bg-[hsl(var(--muted-foreground))/10] transition-colors"
                >
                  {message.note ? (
                    <p className="whitespace-pre-wrap">{message.note}</p>
                  ) : (
                    <p className="text-[hsl(var(--muted-foreground))]">انقر لإضافة ملاحظة...</p>
                  )}
                </div>
              )}
              
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                {new Date(message.created_at).toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center text-[hsl(var(--muted-foreground))] py-12 rounded-2xl border border-[hsl(var(--muted))] bg-[hsl(var(--muted))]">
            لا توجد رسائل حتى الآن
          </div>
        )}
      </div>
    </div>
  );
}