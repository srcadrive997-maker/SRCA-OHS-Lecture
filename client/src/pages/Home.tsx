/**
 * محاضرة الصحة المهنية والسلامة الوقائية
 * هيئة الهلال الأحمر السعودي
 * Designed by: Metwally Amin Helwa
 * 
 * Design: World-class Medical Protocol - Minister-grade presentation
 * Colors: SRCA Red (#c62828), Medical Blue (#0d47a1), Safety Green (#2e7d32)
 * Typography: Tajawal (headings), Cairo (body) - LARGE readable sizes
 * Layout: Single-page scrolling lecture with fixed bottom nav
 */

import { useState, useRef, useEffect, useCallback } from "react";
import emailjs from "@emailjs/browser";
import { sections, pitfalls, importantRules, interactiveScenarios, lectureTitle, lectureSubtitle } from "@/data/lectureContent";
import { getRandomQuestions, verifyAnswer, getCorrectIndex } from "@/data/questionBank";
import type { Question } from "@/data/questionBank";
import type { Section, ContentBlock } from "@/data/lectureContent";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info,
  BookOpen, Award, Brain, FileText, Send, Clock, ArrowRight, ArrowLeft,
  Shield, Skull, Lightbulb, ClipboardList, Heart, Star, Activity,
  Stethoscope, Syringe, Thermometer, Eye, Zap, ShieldCheck, Flame
} from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029254634/dijtbjEZMruKmvJ8fjWPKo/hero-banner_e1dbdbb2.png";
const INFECTION_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029254634/dijtbjEZMruKmvJ8fjWPKo/infection-control_cf638033.png";
const LIFTING_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029254634/dijtbjEZMruKmvJ8fjWPKo/safe-lifting_a3c4f9d1.png";
const MENTAL_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029254634/dijtbjEZMruKmvJ8fjWPKo/mental-health_b9163187.png";
const AMBULANCE_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029254634/dijtbjEZMruKmvJ8fjWPKo/ambulance-safety_a7caf1db.png";
const SRCA_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029254634/dijtbjEZMruKmvJ8fjWPKo/SRCAlogo_intl_cmyk_91eb8305.webp";

// ============ FLOATING GLOWING MEDICAL ICONS ============
function FloatingMedicalIcons() {
  const icons = [
    { Icon: Activity, color: "#c62828", top: "8%", left: "5%", delay: 0, size: 28 },
    { Icon: Heart, color: "#e53935", top: "15%", left: "88%", delay: 1.5, size: 24 },
    { Icon: Stethoscope, color: "#0d47a1", top: "25%", left: "92%", delay: 0.8, size: 26 },
    { Icon: Shield, color: "#2e7d32", top: "35%", left: "3%", delay: 2.2, size: 22 },
    { Icon: Syringe, color: "#7b1fa2", top: "45%", left: "90%", delay: 1.2, size: 20 },
    { Icon: Thermometer, color: "#e65100", top: "55%", left: "4%", delay: 0.5, size: 24 },
    { Icon: Eye, color: "#1565c0", top: "65%", left: "93%", delay: 1.8, size: 22 },
    { Icon: Zap, color: "#f57f17", top: "72%", left: "6%", delay: 2.5, size: 20 },
    { Icon: ShieldCheck, color: "#2e7d32", top: "82%", left: "91%", delay: 0.3, size: 26 },
    { Icon: Flame, color: "#c62828", top: "90%", left: "5%", delay: 1.0, size: 22 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute floating-icon"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -15, 0, 10, 0],
            opacity: [0.15, 0.3, 0.15, 0.25, 0.15],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <div className="floating-glow" style={{ color: item.color }}>
            <item.Icon size={item.size} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============ WATERMARK COMPONENT ============
function SRCAWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]">
        <img src={SRCA_LOGO} alt="" width="400" height="200" className="pointer-events-none select-none" draggable={false} />
      </div>
      <div className="absolute top-20 right-10 opacity-[0.03] rotate-12">
        <img src={SRCA_LOGO} alt="" width="250" height="125" className="pointer-events-none select-none" draggable={false} />
      </div>
      <div className="absolute bottom-40 left-10 opacity-[0.03] -rotate-12">
        <img src={SRCA_LOGO} alt="" width="250" height="125" className="pointer-events-none select-none" draggable={false} />
      </div>
    </div>
  );
}

// ============ DESIGNER CREDIT ============
function DesignerCredit() {
  return (
    <div className="fixed bottom-16 left-2 z-50 opacity-40 hover:opacity-80 transition-opacity">
      <p className="text-[9px] text-gray-500 font-sans" style={{ fontFamily: "'Cairo', sans-serif", direction: "ltr", textAlign: "left" }}>
        Designed by: Metwally Amin Helwa
      </p>
    </div>
  );
}

// ============ CONTENT BLOCK RENDERER ============
function ContentBlockRenderer({ block, index }: { block: ContentBlock; index: number }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (block.type === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-7 mb-5"
      >
        {block.title && <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 font-[Tajawal]">{block.title}</h3>}
        <p className="text-base md:text-lg text-gray-600 leading-loose">{block.text}</p>
      </motion.div>
    );
  }

  if (block.type === "heading") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mt-6 mb-4"
      >
        <h4 className="text-lg md:text-xl font-bold text-[#c62828] font-[Tajawal] flex items-center gap-2">
          <span className="w-2 h-8 bg-[#c62828] rounded-full inline-block"></span>
          {block.title}
        </h4>
      </motion.div>
    );
  }

  if (block.type === "text") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-4"
      >
        <p className="text-base md:text-lg text-gray-600 leading-loose">{block.text}</p>
      </motion.div>
    );
  }

  if (block.type === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-4"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            {block.icon && <span className="text-xl">{block.icon}</span>}
            <h5 className="text-base md:text-lg font-bold text-gray-800 font-[Tajawal]">{block.title}</h5>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {block.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-base md:text-lg text-gray-600">
                  <span className="w-7 h-7 rounded-full bg-gray-100 text-sm flex items-center justify-center shrink-0 mt-0.5 font-bold text-gray-500">{i + 1}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (block.type === "warning") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-red-50 border-r-4 border-[#c62828] rounded-xl p-5 md:p-6 mb-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={22} className="text-[#c62828]" />
          <h5 className="text-base md:text-lg font-bold text-[#c62828] font-[Tajawal]">{block.title}</h5>
        </div>
        <p className="text-base md:text-lg text-red-800 leading-loose">{block.text}</p>
      </motion.div>
    );
  }

  if (block.type === "info") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-blue-50 border-r-4 border-[#0d47a1] rounded-xl p-5 md:p-6 mb-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Info size={22} className="text-[#0d47a1]" />
          <h5 className="text-base md:text-lg font-bold text-[#0d47a1] font-[Tajawal]">{block.title}</h5>
        </div>
        <p className="text-base md:text-lg text-blue-800 leading-loose">{block.text}</p>
      </motion.div>
    );
  }

  if (block.type === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-green-50 border-r-4 border-[#2e7d32] rounded-xl p-5 md:p-6 mb-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={22} className="text-[#2e7d32]" />
          <h5 className="text-base md:text-lg font-bold text-[#2e7d32] font-[Tajawal]">{block.title}</h5>
        </div>
        <p className="text-base md:text-lg text-green-800 leading-loose">{block.text}</p>
      </motion.div>
    );
  }

  if (block.type === "table") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-4 overflow-x-auto"
      >
        {block.title && <h5 className="text-base md:text-lg font-bold text-gray-800 mb-4 font-[Tajawal]">{block.title}</h5>}
        <table className="w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {block.headers?.map((h, i) => (
                <th key={i} className="p-3 text-right font-bold text-gray-700 border-b-2 border-gray-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows?.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {row.map((cell, j) => (
                  <td key={j} className="p-3 text-gray-600 border-b border-gray-100 leading-relaxed">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    );
  }

  if (block.type === "steps") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-4"
      >
        {block.title && <h5 className="text-base md:text-lg font-bold text-gray-800 mb-4 font-[Tajawal]">{block.title}</h5>}
        <div className="space-y-4">
          {block.items?.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c62828] text-white text-sm flex items-center justify-center shrink-0 font-bold">{i + 1}</div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed pt-1">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
}

// ============ SECTION RENDERER ============
function SectionRenderer({ section, sectionIndex }: { section: Section; sectionIndex: number }) {
  return (
    <div id={section.id} className="mb-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5 p-4 rounded-xl"
        style={{ backgroundColor: section.color + "10" }}
      >
        <span className="text-3xl md:text-4xl">{section.icon}</span>
        <div>
          <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">القسم {sectionIndex}</span>
          <h2 className="text-xl md:text-2xl font-bold font-[Tajawal]" style={{ color: section.color }}>{section.title}</h2>
        </div>
      </motion.div>
      {section.content.map((block, i) => (
        <ContentBlockRenderer key={i} block={block} index={i} />
      ))}
    </div>
  );
}

// ============ PITFALLS SECTION ============
function PitfallsSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div id="pitfalls" className="mb-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-red-50"
      >
        <span className="text-3xl md:text-4xl">🔎</span>
        <div>
          <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">الأخطاء الشائعة</span>
          <h2 className="text-xl md:text-2xl font-bold font-[Tajawal] text-[#c62828]">Pitfalls - أخطاء يجب تجنبها</h2>
        </div>
      </motion.div>
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
        <p className="text-base md:text-lg text-red-700 flex items-center gap-2">
          <Skull size={20} />
          هذه الأخطاء قد تكون قاتلة أو تسبب أضراراً جسيمة. تعلّم منها لتتجنبها.
        </p>
      </div>
      <div className="space-y-4">
        {pitfalls.map((pitfall, i) => (
          <motion.div
            key={pitfall.id}
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
              pitfall.severity === "critical" ? "border-red-200" : "border-orange-200"
            }`}
          >
            <button
              onClick={() => setExpandedId(expandedId === pitfall.id ? null : pitfall.id)}
              className="w-full p-5 flex items-start gap-3 text-right"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold ${
                pitfall.severity === "critical" ? "bg-[#c62828]" : "bg-orange-500"
              }`}>
                {pitfall.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    pitfall.severity === "critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {pitfall.severity === "critical" ? "حرج" : "مهم"}
                  </span>
                  <span className="text-xs text-gray-400">{pitfall.module}</span>
                </div>
                <h4 className="text-base md:text-lg font-bold text-gray-800 font-[Tajawal]">{pitfall.title}</h4>
              </div>
              {expandedId === pitfall.id ? <ChevronUp size={20} className="text-gray-400 mt-1" /> : <ChevronDown size={20} className="text-gray-400 mt-1" />}
            </button>
            <AnimatePresence>
              {expandedId === pitfall.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-3">
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-sm md:text-base font-bold text-red-700 mb-1">❌ الخطأ:</p>
                      <p className="text-sm md:text-base text-red-600 leading-relaxed">{pitfall.description}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <p className="text-sm md:text-base font-bold text-orange-700 mb-1">⚠️ العاقبة:</p>
                      <p className="text-sm md:text-base text-orange-600 leading-relaxed">{pitfall.consequence}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-sm md:text-base font-bold text-green-700 mb-1">✅ الصحيح:</p>
                      <p className="text-sm md:text-base text-green-600 leading-relaxed">{pitfall.correct}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============ RULES SECTION ============
function RulesSection() {
  return (
    <div id="rules" className="mb-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-green-50"
      >
        <span className="text-3xl md:text-4xl">📋</span>
        <div>
          <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">القواعد الذهبية</span>
          <h2 className="text-xl md:text-2xl font-bold font-[Tajawal] text-[#2e7d32]">القواعد المهمة التي يجب حفظها</h2>
        </div>
      </motion.div>
      <div className="space-y-4">
        {importantRules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl shadow-sm border border-green-100 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-2xl">
                {rule.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold">{rule.category}</span>
                </div>
                <h4 className="text-base md:text-lg font-bold text-gray-800 font-[Tajawal] mb-2">{rule.rule}</h4>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed">{rule.explanation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============ SUMMARY SECTION ============
function SummarySection() {
  const summaryItems = [
    { title: "مسؤولو الصحة المهنية", summary: "تحديد الأدوار: مدير الصحة المهنية، مسؤول الفرع، ضابط السلامة الميداني. كل منهم مسؤول عن جانب من السلامة.", icon: "👨‍⚕️", color: "#1565c0" },
    { title: "التلوث والمواد الخطرة CBRN", summary: "4 أنواع: بيولوجي (دم/إفرازات)، كيميائي (أحماض/سموم)، إشعاعي، غازات. لكل نوع معدات وقاية وإجراءات خاصة.", icon: "☢️", color: "#e65100" },
    { title: "إزالة التلوث والتطهير", summary: "تطهير المركبات بعد كل حالة بمطهرات معتمدة. تطهير المراكز يومياً. توثيق كل عملية تطهير. التركيز على الأسطح كثيرة اللمس.", icon: "🧹", color: "#2e7d32" },
    { title: "سلامة موقع الحادث", summary: "سلامة الطاقم أولاً. تقييم الموقع قبل الدخول. تصنيف: آمن/غير مستقر/غير آمن. لا تواجه المعتدين. التقييم المستمر.", icon: "🚧", color: "#f57f17" },
    { title: "سلامة مشغلي المركبات", summary: "فحص يومي للمركبة. رخصة إسعافية + قيادة دفاعية. حزام أمان للجميع. لا هاتف أثناء القيادة. توقف تام عند التقاطعات.", icon: "🚑", color: "#0d47a1" },
    { title: "مكافحة العدوى", summary: "PPE إلزامي. 5 لحظات لنظافة اليدين. فرز النفايات (حمراء/Sharps/سوداء). لا إعادة تغطية الإبر. تطعيمات إلزامية.", icon: "🦠", color: "#4a148c" },
    { title: "الصحة الشخصية وسلامة المرضى", summary: "رفع آمن (ركبتين لا ظهر). دعم نفسي. أسطوانات أكسجين مثبتة. قاعدة التحقق الخمسية للأدوية. إبلاغ فوري عن الإصابات.", icon: "❤️", color: "#c62828" }
  ];

  return (
    <div id="summary" className="mb-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-blue-50"
      >
        <span className="text-3xl md:text-4xl">📑</span>
        <div>
          <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">ملخص سريع</span>
          <h2 className="text-xl md:text-2xl font-bold font-[Tajawal] text-[#0d47a1]">ملخص المحاضرة</h2>
        </div>
      </motion.div>
      <div className="space-y-4">
        {summaryItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl" style={{ backgroundColor: item.color + "15" }}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-base md:text-lg font-bold font-[Tajawal] mb-2" style={{ color: item.color }}>{item.title}</h4>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.summary}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============ INTERACTIVE SECTION ============
function InteractiveSection() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const scenario = interactiveScenarios[currentScenario];

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % interactiveScenarios.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div id="interactive" className="mb-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-purple-50"
      >
        <span className="text-3xl md:text-4xl">🎯</span>
        <div>
          <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">تفاعلي</span>
          <h2 className="text-xl md:text-2xl font-bold font-[Tajawal] text-purple-800">سيناريوهات تفاعلية للمسعفين</h2>
        </div>
      </motion.div>
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm md:text-base text-purple-600 font-bold">السيناريو {currentScenario + 1} من {interactiveScenarios.length}</span>
          <div className="flex gap-1.5">
            {interactiveScenarios.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i === currentScenario ? "bg-purple-600" : "bg-purple-200"}`} />
            ))}
          </div>
        </div>
        <h4 className="text-base md:text-lg font-bold text-gray-800 font-[Tajawal] mb-4">{scenario.title}</h4>
        <div className="bg-purple-50 rounded-xl p-4 mb-4">
          <p className="text-sm md:text-base text-purple-800 leading-relaxed">{scenario.scenario}</p>
        </div>
        <p className="text-base md:text-lg font-bold text-gray-700 mb-4">{scenario.question}</p>
        <div className="space-y-3 mb-4">
          {scenario.options.map((option, i) => (
            <button
              key={i}
              onClick={() => !showResult && handleAnswer(i)}
              disabled={showResult}
              className={`w-full text-right p-4 rounded-xl border text-sm md:text-base transition-all ${
                showResult
                  ? i === scenario.correctAnswer
                    ? "bg-green-50 border-green-300 text-green-800"
                    : i === selectedAnswer
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                  : "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                  showResult && i === scenario.correctAnswer ? "bg-green-500 text-white" :
                  showResult && i === selectedAnswer ? "bg-red-500 text-white" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {showResult && i === scenario.correctAnswer ? "✓" : showResult && i === selectedAnswer ? "✗" : String.fromCharCode(65 + i)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-4 ${selectedAnswer === scenario.correctAnswer ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <p className={`text-sm md:text-base font-bold mb-1 ${selectedAnswer === scenario.correctAnswer ? "text-green-700" : "text-red-700"}`}>
                {selectedAnswer === scenario.correctAnswer ? "✅ إجابة صحيحة!" : "❌ إجابة خاطئة"}
              </p>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">{scenario.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {showResult && (
          <button
            onClick={nextScenario}
            className="w-full bg-purple-600 text-white py-3 rounded-xl text-base font-bold hover:bg-purple-700 transition-colors"
          >
            السيناريو التالي ←
          </button>
        )}
      </div>
    </div>
  );
}

// ============ MCQ ASSESSMENT ============
function MCQAssessment() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [showNameForm, setShowNameForm] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startExam = useCallback(() => {
    if (!studentName.trim()) return;
    const qs = getRandomQuestions(20);
    setQuestions(qs);
    setStarted(true);
    setShowNameForm(false);
    setCurrentQ(0);
    setAnswers({});
    setFinished(false);
    setTimeLeft(20 * 60);
    setEmailSent(false);
  }, [studentName]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const handleAnswer = (qIndex: number, aIndex: number) => {
    if (finished) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: aIndex }));
  };

  const finishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
  };

  const score = questions.reduce((acc, q, i) => {
    return acc + (answers[i] !== undefined && verifyAnswer(q, answers[i]) ? 1 : 0);
  }, 0);

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = percentage >= 60;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const sendResults = async () => {
    setEmailSending(true);
    const results = questions.map((q, i) => {
      const userAnswer = answers[i] !== undefined ? q.options[answers[i]] : "لم يُجب";
      const correctIdx = getCorrectIndex(q);
      const correct = q.options[correctIdx];
      const isCorrect = answers[i] !== undefined && verifyAnswer(q, answers[i]);
      return `السؤال ${i + 1}: ${q.question}\nإجابة المسعف: ${userAnswer}\nالإجابة الصحيحة: ${correct}\nالنتيجة: ${isCorrect ? "✅ صحيح" : "❌ خطأ"}\n`;
    }).join("\n---\n");

    const messageBody = `بسم الله الرحمن الرحيم\n\n📋 نتيجة تقييم محاضرة الصحة المهنية والسلامة الوقائية\n\n👤 اسم المسعف: ${studentName}\n🆔 الكود الوظيفي: ${studentId || "غير محدد"}\n📊 النتيجة: ${score}/${questions.length} (${percentage}%)\n${passed ? "✅ ناجح" : "❌ راسب"}\n⏱️ الوقت المتبقي: ${formatTime(timeLeft)}\n📅 التاريخ: ${new Date().toLocaleDateString("ar-SA")}\n\n${'='.repeat(50)}\n\nتفاصيل الإجابات:\n\n${results}\n\n${'='.repeat(50)}\nDesigned by: Metwally Amin Helwa\nهيئة الهلال الأحمر السعودي - إدارة الصحة المهنية`;

    try {
      await emailjs.send(
        'service_ftcayir',
        'template_fb385iu',
        {
          student_name: studentName,
          percentage: percentage.toString(),
          message: messageBody,
          name: studentName,
        },
        'Qma6Q0VFXXNapMa4h'
      );
      setEmailSent(true);
    } catch (error) {
      console.error('EmailJS error:', error);
      const subject = `نتيجة تقييم الصحة المهنية - ${studentName} - ${percentage}%`;
      const mailtoLink = `mailto:srcadrive997@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`;
      window.open(mailtoLink, '_blank');
      setEmailSent(true);
    } finally {
      setEmailSending(false);
    }
  };

  if (!started) {
    return (
      <div id="assessment" className="mb-10 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-amber-50"
        >
          <span className="text-3xl md:text-4xl">📝</span>
          <div>
            <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">تقييم</span>
            <h2 className="text-xl md:text-2xl font-bold font-[Tajawal] text-amber-800">تقييم المسعفين - اختبار MCQ</h2>
          </div>
        </motion.div>
        {showNameForm ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-amber-100 p-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Award size={36} className="text-amber-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 font-[Tajawal]">تقييم محاضرة الصحة المهنية</h3>
              <p className="text-sm md:text-base text-gray-500 mt-2">20 سؤال عشوائي من بنك 90 سؤالاً | المدة: 20 دقيقة | نسبة النجاح: 60%</p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm md:text-base font-bold text-gray-600 mb-2 block">اسم المسعف *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full p-4 border border-gray-200 rounded-xl text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="text-sm md:text-base font-bold text-gray-600 mb-2 block">الرقم الوظيفي</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="أدخل رقمك الوظيفي (اختياري)"
                  className="w-full p-4 border border-gray-200 rounded-xl text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 mb-5">
              <h4 className="text-sm md:text-base font-bold text-amber-800 mb-3">تعليمات التقييم:</h4>
              <ul className="space-y-2 text-sm md:text-base text-amber-700">
                <li>• 20 سؤال اختيار من متعدد (MCQ)</li>
                <li>• المدة: 20 دقيقة - يُغلق التقييم تلقائياً بعد انتهاء الوقت</li>
                <li>• نسبة النجاح: 60% (12 إجابة صحيحة من 20)</li>
                <li>• يمكنك التنقل بين الأسئلة بالأسهم</li>
                <li>• سيتم إرسال النتيجة بالبريد الإلكتروني</li>
              </ul>
            </div>
            <button
              onClick={startExam}
              disabled={!studentName.trim()}
              className="w-full bg-[#c62828] text-white py-4 rounded-xl text-base md:text-lg font-bold hover:bg-[#b71c1c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              ابدأ التقييم
            </button>
          </motion.div>
        ) : null}
      </div>
    );
  }

  if (finished) {
    return (
      <div id="assessment" className="mb-10 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="text-center mb-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100" : "bg-red-100"}`}>
              {passed ? <CheckCircle2 size={44} className="text-green-600" /> : <X size={44} className="text-red-600" />}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-[Tajawal] text-gray-800">{passed ? "مبارك! نجحت في التقييم" : "لم تجتز التقييم"}</h3>
            <p className="text-base md:text-lg text-gray-500 mt-2">{studentName}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{score}/{questions.length}</p>
              <p className="text-xs md:text-sm text-gray-500">الإجابات الصحيحة</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${passed ? "bg-green-50" : "bg-red-50"}`}>
              <p className={`text-2xl md:text-3xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{percentage}%</p>
              <p className="text-xs md:text-sm text-gray-500">النسبة</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">{formatTime(20 * 60 - timeLeft)}</p>
              <p className="text-xs md:text-sm text-gray-500">الوقت المستغرق</p>
            </div>
          </div>
          <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto">
            {questions.map((q, i) => {
              const isCorrect = answers[i] !== undefined && verifyAnswer(q, answers[i]);
              const notAnswered = answers[i] === undefined;
              return (
                <div key={i} className={`p-4 rounded-xl border text-sm md:text-base ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <div>
                      <p className="font-bold text-gray-700 mb-1">س{i + 1}: {q.question}</p>
                      {!notAnswered && !isCorrect && (
                        <p className="text-red-600">إجابتك: {q.options[answers[i]]}</p>
                      )}
                      {notAnswered && <p className="text-gray-500">لم تُجب</p>}
                      <p className="text-green-700">الإجابة الصحيحة: تظهر في البريد الإلكتروني فقط</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            <button
              onClick={sendResults}
              disabled={emailSending || emailSent}
              className={`w-full py-4 rounded-xl text-base md:text-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                emailSent ? "bg-green-600 text-white" : emailSending ? "bg-gray-400 text-white cursor-wait" : "bg-[#c62828] text-white hover:bg-[#b71c1c]"
              }`}
            >
              {emailSending ? (
                <><Clock size={20} className="animate-spin" /> جاري إرسال النتيجة...</>
              ) : emailSent ? (
                <><CheckCircle2 size={20} /> تم إرسال النتيجة بنجاح إلى المشرف</>
              ) : (
                <><Send size={20} /> إرسال النتيجة تلقائياً للمشرف</>
              )}
            </button>
            <button
              onClick={() => {
                setStarted(false);
                setShowNameForm(true);
                setFinished(false);
                setEmailSent(false);
              }}
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl text-base md:text-lg font-bold hover:bg-gray-200 transition-colors"
            >
              إعادة التقييم
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active exam
  const q = questions[currentQ];
  return (
    <div id="assessment" className="mb-10 scroll-mt-24">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Timer bar */}
        <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <Clock size={18} className={timeLeft < 120 ? "text-red-500 animate-pulse" : "text-gray-500"} />
            <span className={`text-base md:text-lg font-bold font-mono ${timeLeft < 120 ? "text-red-500" : "text-gray-700"}`}>{formatTime(timeLeft)}</span>
          </div>
          <span className="text-sm md:text-base text-gray-500">السؤال {currentQ + 1} من {questions.length}</span>
          <span className="text-sm md:text-base font-bold text-gray-600">{Object.keys(answers).length}/{questions.length} مُجاب</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div className="bg-[#c62828] h-1.5 transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>
        {/* Question */}
        <div className="p-5 md:p-6">
          <div className="mb-2">
            <span className="text-xs md:text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-bold">{q.module}</span>
          </div>
          <h4 className="text-base md:text-xl font-bold text-gray-800 font-[Tajawal] mb-5 leading-relaxed">{q.question}</h4>
          <div className="space-y-3 mb-5">
            {q.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(currentQ, i)}
                className={`w-full text-right p-4 rounded-xl border text-sm md:text-base transition-all ${
                  answers[currentQ] === i
                    ? "bg-[#c62828] border-[#c62828] text-white"
                    : "bg-white border-gray-200 hover:border-[#c62828] hover:bg-red-50 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                    answers[currentQ] === i ? "bg-white text-[#c62828]" : "bg-gray-100 text-gray-500"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </div>
              </button>
            ))}
          </div>
          {/* Question dots */}
          <div className="flex flex-wrap gap-1.5 mb-5 justify-center">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  i === currentQ
                    ? "bg-[#c62828] text-white"
                    : answers[i] !== undefined
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {/* Navigation arrows */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentQ((prev) => Math.max(0, prev - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm md:text-base font-bold hover:bg-gray-200 disabled:opacity-30 transition-all"
            >
              <ArrowRight size={18} />
              السابق
            </button>
            {currentQ === questions.length - 1 ? (
              <button
                onClick={finishExam}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#c62828] text-white text-sm md:text-base font-bold hover:bg-[#b71c1c] transition-all"
              >
                إنهاء التقييم
                <CheckCircle2 size={18} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#c62828] text-white text-sm md:text-base font-bold hover:bg-[#b71c1c] transition-all"
              >
                التالي
                <ArrowLeft size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SIDEBAR MENU ============
function SidebarMenu({ isOpen, onClose, onNavigate }: { isOpen: boolean; onClose: () => void; onNavigate: (id: string) => void }) {
  const menuItems = [
    { id: "hero", label: "الرئيسية", icon: "🏠" },
    { id: "intro", label: "المقدمة", icon: "📋" },
    { id: "module1", label: "مسؤولو الصحة المهنية", icon: "👨‍⚕️" },
    { id: "module2", label: "التلوث والمواد الخطرة", icon: "☢️" },
    { id: "module3", label: "إزالة التلوث والتطهير", icon: "🧹" },
    { id: "module4", label: "سلامة موقع الحادث", icon: "🚧" },
    { id: "module5", label: "سلامة مشغلي المركبات", icon: "🚑" },
    { id: "module6", label: "مكافحة العدوى", icon: "🦠" },
    { id: "module7", label: "الصحة الشخصية وسلامة المرضى", icon: "❤️" },
    { id: "pitfalls", label: "الأخطاء الشائعة (Pitfalls)", icon: "🔎" },
    { id: "rules", label: "القواعد المهمة", icon: "📋" },
    { id: "summary", label: "الملخص", icon: "📑" },
    { id: "interactive", label: "سيناريوهات تفاعلية", icon: "🎯" },
    { id: "assessment", label: "التقييم (MCQ)", icon: "📝" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-5 bg-[#c62828] text-white">
              <div className="flex items-center justify-between mb-2">
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                  <X size={22} />
                </button>
                <h3 className="text-base md:text-lg font-bold font-[Tajawal]">فهرس المحاضرة</h3>
              </div>
            </div>
            <div className="p-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); onClose(); }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-right"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm md:text-base font-bold text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============ MAIN HOME COMPONENT ============
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative" dir="rtl">
      <SRCAWatermark />
      <FloatingMedicalIcons />
      <DesignerCredit />
      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={scrollTo} />

      {/* ===== HERO SECTION ===== */}
      <div id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 px-5 py-14 md:py-20 text-center">
          {/* SRCA Logo */}
          <div className="mb-5">
            <img src={SRCA_LOGO} alt="هيئة الهلال الأحمر السعودي" width="200" height="100" className="mx-auto drop-shadow-lg" style={{filter: 'brightness(0) invert(1)'}} />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-[Tajawal] mb-3 leading-tight">
            {lectureTitle}
          </h1>
          <p className="text-sm md:text-lg text-white/80 mb-6 leading-relaxed max-w-xl mx-auto">
            {lectureSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm text-white font-bold">7 أقسام رئيسية</span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm text-white font-bold">سيناريوهات تفاعلية</span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs md:text-sm text-white font-bold">تقييم MCQ</span>
          </div>
          <button
            onClick={() => scrollTo("intro")}
            className="inline-flex items-center gap-2 bg-[#c62828] text-white px-10 py-4 rounded-full text-base md:text-lg font-bold hover:bg-[#b71c1c] transition-all shadow-lg hover:shadow-xl animate-pulse-red"
          >
            <BookOpen size={20} />
            ابدأ المحاضرة
          </button>
        </div>
      </div>

      {/* ===== NAVIGATION TABS ===== */}
      <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 p-2.5 min-w-max">
            {[
              { id: "intro", icon: "📋", label: "المقدمة" },
              { id: "module1", icon: "👨‍⚕️", label: "المسؤولون" },
              { id: "module2", icon: "☢️", label: "CBRN" },
              { id: "module3", icon: "🧹", label: "التطهير" },
              { id: "module4", icon: "🚧", label: "الموقع" },
              { id: "module5", icon: "🚑", label: "المركبات" },
              { id: "module6", icon: "🦠", label: "العدوى" },
              { id: "module7", icon: "❤️", label: "السلامة" },
              { id: "pitfalls", icon: "🔎", label: "Pitfalls" },
              { id: "rules", icon: "📋", label: "القواعد" },
              { id: "summary", icon: "📑", label: "الملخص" },
              { id: "interactive", icon: "🎯", label: "تفاعلي" },
              { id: "assessment", icon: "📝", label: "التقييم" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap bg-gray-50 hover:bg-red-50 hover:text-[#c62828] transition-colors text-gray-600"
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="px-4 md:px-6 py-8 pb-28 max-w-3xl mx-auto relative z-10">
        {/* Sections */}
        {sections.map((section, i) => (
          <SectionRenderer key={section.id} section={section} sectionIndex={i} />
        ))}

        {/* Pitfalls */}
        <PitfallsSection />

        {/* Rules */}
        <RulesSection />

        {/* Summary */}
        <SummarySection />

        {/* Interactive */}
        <InteractiveSection />

        {/* MCQ Assessment */}
        <MCQAssessment />

        {/* References */}
        <div className="mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800 font-[Tajawal] mb-4 flex items-center gap-2">
              <FileText size={20} className="text-gray-400" />
              المراجع
            </h3>
            <ul className="space-y-2 text-sm md:text-base text-gray-500">
              <li>1. National EMS Safety Council (NAEMT)</li>
              <li>2. منظمة العمل الدولية (ILO)</li>
              <li>3. منظمة الصحة العالمية (WHO)</li>
              <li>4. ISO 45001 - نظام إدارة السلامة والصحة المهنية</li>
              <li>5. OSHA – Emergency Response & Scene Safety</li>
              <li>6. CDC – Infection Control Guidelines</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <img src={SRCA_LOGO} alt="هيئة الهلال الأحمر السعودي" width="140" height="70" className="mx-auto mb-3 opacity-40" />
          <p className="text-sm text-gray-400">هيئة الهلال الأحمر السعودي</p>
          <p className="text-sm text-gray-400">الإدارة العامة للشؤون الطبية - إدارة الصحة المهنية</p>
          <p className="text-xs text-gray-300 mt-3" style={{ direction: "ltr" }}>Designed by: Metwally Amin Helwa</p>
        </div>
      </main>

      {/* ===== BOTTOM NAVIGATION BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex items-center justify-around py-2.5 px-3 max-w-lg mx-auto">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-1.5"
          >
            <Menu size={22} className="text-gray-600" />
            <span className="text-[10px] md:text-xs text-gray-500 font-bold">القائمة</span>
          </button>
          <button
            onClick={() => scrollTo("assessment")}
            className="flex flex-col items-center gap-1 px-5 py-1.5 bg-[#c62828] rounded-xl text-white shadow-md"
          >
            <Award size={22} />
            <span className="text-[10px] md:text-xs font-bold">التقييم</span>
          </button>
          <button
            onClick={() => scrollTo("interactive")}
            className="flex flex-col items-center gap-1 px-4 py-1.5"
          >
            <Brain size={22} className="text-gray-600" />
            <span className="text-[10px] md:text-xs text-gray-500 font-bold">تفاعلي</span>
          </button>
          <button
            onClick={() => scrollTo("hero")}
            className="flex flex-col items-center gap-1 px-4 py-1.5"
          >
            <Heart size={22} className="text-gray-600" />
            <span className="text-[10px] md:text-xs text-gray-500 font-bold">الرئيسية</span>
          </button>
        </div>
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-20 left-4 w-12 h-12 rounded-full bg-[#c62828] text-white shadow-lg flex items-center justify-center z-40 hover:bg-[#b71c1c] transition-colors"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
