import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "What documents do I need for most scholarships?",
  "How do I write a strong scholarship essay?",
  "What's the difference between merit and need-based scholarships?",
  "How do I improve my scholarship match score?",
  "When should I start applying for scholarships?",
  "How can I find scholarships for STEM students?",
];

type ResponseKey = string;

const DEMO_RESPONSES: Record<string, string> = {
  'documents': `**Common scholarship documents you'll need:**

📄 **Academic Records**
- Official transcripts (sealed, from your institution)
- Test scores (SAT, ACT, GRE, GMAT as applicable)

✍️ **Written Materials**
- Personal statement or essay (usually 300–800 words)
- Statement of purpose (for graduate scholarships)

📋 **References**
- Letters of recommendation (2–3 from teachers, advisors, or employers)

💰 **Financial Documents** *(for need-based scholarships)*
- FAFSA Student Aid Report (SAR)
- Family income tax returns

📁 **Supporting Materials**
- Resume or CV
- Portfolio (for arts/design scholarships)
- Community service verification letters

**Pro tip:** Keep digital copies of all documents organized in folders. Many applications reuse the same materials!`,

  'essay': `**How to write a compelling scholarship essay:**

🎯 **Start with a strong hook**
Open with a memorable story, quote, or insight — not "I am applying because..."

📖 **Be specific and personal**
Use real examples from your life. Committees read hundreds of essays; yours should feel authentic and unique.

🔗 **Connect to the scholarship's mission**
Research the organization's values and show how you align with them.

📝 **Structure it well**
- Introduction: Hook + thesis
- Body: 2–3 supporting points with examples
- Conclusion: Tie it back and look forward

✅ **Polish it**
- Proofread multiple times
- Ask a teacher or advisor to review it
- Read it aloud to catch awkward phrasing

⚠️ **What to avoid**
- Generic statements that could apply to anyone
- Repeating your resume without adding context
- Exceeding the word limit

**Remember:** This is your chance to show who you are beyond your grades!`,

  'merit need': `**Merit vs. Need-Based Scholarships:**

🏆 **Merit-Based Scholarships**
- Awarded based on academic achievement, talent, or specific abilities
- Usually requires a minimum GPA (often 3.0–3.8+)
- May also consider leadership, community service, or artistic talent
- Income is generally not a factor
- *Examples in Grantly:* National Merit Excellence Award, STEM Innovation Fellowship

💰 **Need-Based Scholarships**
- Awarded based on demonstrated financial need
- Requires financial documentation (FAFSA, income verification)
- Often has an annual family income cap
- Academic performance may still be a secondary factor
- *Examples in Grantly:* Financial Need Excellence Grant, First Generation Scholars Fund

🔀 **Hybrid Scholarships**
Many scholarships combine both — requiring a minimum GPA *and* demonstrating financial need. These can be very competitive but highly rewarding.

**Strategy:** Apply to both types! Don't assume you won't qualify for need-based aid — many families earning up to $100,000 still qualify for some programs.`,

  'match score': `**How to improve your scholarship match score:**

Your match score is calculated based on how well your profile aligns with a scholarship's requirements. Here's how to boost it:

📚 **Academic GPA**
- Many scholarships require 3.0–3.8+ GPA
- Focus on improving your current semester grades

🎯 **Update Your Profile Interests**
- Go to My Profile and add relevant scholarship categories
- The more accurate your interests, the better your matches

🏫 **Education Level & Course**
- Ensure your education level and field of study are current
- Specific scholarships target specific majors — accuracy matters

💵 **Income Information**
- Keep family income information accurate for need-based matches

🌍 **Location**
- Some scholarships are state-specific — ensure your state is correct

⚠️ **Important Disclaimer**
Match scores are *estimates* based on your profile. They don't guarantee eligibility. Always read full scholarship requirements before applying.`,

  'when': `**When should you start applying for scholarships?**

📅 **Earlier is always better — here's a timeline:**

**High School Junior Year (11th Grade)**
- Research scholarships and create an organized spreadsheet
- Start building your profile: GPA, activities, community service
- Begin drafting a general personal statement

**High School Senior Year (12th Grade)**
- August–September: Start applications for early deadlines
- October–December: Peak application season — apply actively
- January–March: Second wave of deadlines

**College Students**
- Apply at the *start* of each academic year
- Many scholarships renew annually — apply every year!
- Look for departmental scholarships through your college

**Key principles:**
✅ Apply as early as possible — early applicants often have higher success rates
✅ Set calendar reminders 30, 14, and 7 days before each deadline
✅ Don't wait for the "perfect" application — submit and iterate
✅ Apply even if you don't think you'll win — you might surprise yourself!`,

  'stem': `**Finding scholarships for STEM students:**

🔬 **On Grantly, filter by:**
- Category: "STEM" or "Women in STEM"
- Education Level: Undergraduate or Graduate
- Sort by match score for most relevant results

🏛️ **Top types of STEM scholarships:**
- University departmental awards (check your institution directly)
- Federal programs (NSF, DOE, NASA — search their official sites)
- Corporate scholarships (Google, Microsoft, Amazon, etc.)
- Professional associations (IEEE, ACM, SHPE, NSBE, SWE, etc.)

💡 **Tips for STEM scholarship applications:**
- Highlight research experience, projects, and internships
- Mention specific tools, programming languages, or lab techniques
- Show real-world impact of your technical work
- Discuss how you plan to use your STEM education to solve problems

🌟 **Your STEM profile:**
Based on your Grantly profile (Computer Science), scholarships like the **STEM Innovation Fellowship** and **Women in Technology Leadership Grant** are strong potential matches.

⚠️ Always verify requirements and deadlines on the scholarship provider's official website.`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('document') || lower.includes('require') || lower.includes('need')) return DEMO_RESPONSES['documents'];
  if (lower.includes('essay') || lower.includes('write') || lower.includes('personal statement')) return DEMO_RESPONSES['essay'];
  if (lower.includes('merit') || lower.includes('need-based') || lower.includes('difference') || lower.includes('type')) return DEMO_RESPONSES['merit need'];
  if (lower.includes('match') || lower.includes('score') || lower.includes('improve') || lower.includes('profile')) return DEMO_RESPONSES['match score'];
  if (lower.includes('when') || lower.includes('start') || lower.includes('timeline') || lower.includes('deadline')) return DEMO_RESPONSES['when'];
  if (lower.includes('stem') || lower.includes('science') || lower.includes('tech') || lower.includes('engineering')) return DEMO_RESPONSES['stem'];

  return `Thanks for your question! I'm Grantly's scholarship assistant.

Here are some things I can help you with:
- 📄 **Documents**: What materials are typically required
- ✍️ **Essay tips**: How to write a compelling application essay
- 🏆 **Scholarship types**: Merit vs. need-based differences
- 📊 **Match scores**: How to improve your scholarship matching
- 📅 **Timeline**: When to start applying
- 🔬 **STEM opportunities**: Finding scholarships in your field

Try asking about any of these topics, or use one of the suggested prompts below the chat!

⚠️ *Note: I'm a demo assistant with pre-written responses. I'm not connected to a live AI service.*`;
}

function formatContent(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your Grantly scholarship assistant. 👋

I can help you understand scholarship requirements, write better applications, compare opportunities, and navigate the application process.

What would you like to know today?

⚠️ *This is a demo assistant with predefined responses. It is not connected to a live AI service.*`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const response = getResponse(text);
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setLoading(false);
    }, 800 + Math.random() * 600);
  }

  function handleReset() {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your Grantly scholarship assistant. 👋\n\nI can help you understand scholarship requirements, write better applications, compare opportunities, and navigate the application process.\n\nWhat would you like to know today?\n\n⚠️ *This is a demo assistant with predefined responses. It is not connected to a live AI service.*`,
      timestamp: new Date(),
    }]);
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="p-5 lg:px-8 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-main-text">AI Scholarship Assistant</h2>
            <p className="text-xs text-secondary-text">Demo responses · Not a live AI</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RefreshCw className="w-4 h-4" /> New Chat
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-6 space-y-5">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
            >
              <div className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
                msg.role === 'assistant' ? 'bg-primary' : 'bg-primary-light'
              )}>
                {msg.role === 'assistant'
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-primary" />
                }
              </div>
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-white border border-border text-main-text rounded-tl-sm'
                  : 'bg-primary text-white rounded-tr-sm'
              )}
                dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-secondary-text rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-5 lg:px-8 pb-3 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-border bg-white text-xs text-secondary-text hover:border-primary/40 hover:text-primary hover:bg-primary-light transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-5 lg:px-8 pb-5 flex-shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ask about scholarships, eligibility, essays..."
            className="flex-1 h-11 rounded-xl border border-border bg-white px-4 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} className="h-11 w-11 p-0 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
