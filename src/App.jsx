import React, { useEffect, useMemo, useRef, useState } from "react";
import DnaBackground from "./DnaBackground";
import {
  ArrowRight,
  ArrowUp,
  Award,
  Baby,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  FlaskConical,
  HeartPulse,
  Home as HomeIcon,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Phone,
  Search,
  ShoppingCart,
  ShieldCheck,
  Stethoscope,
  UserRound,
  MessageCircle,
  X
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";

import { clinic } from "./config";

import { exams, examCategories } from "./examsData";

import useScrollReveal from "./useScrollReveal";

// Catálogo oficial fornecido pela EXATTA.

const examBatteries = [
  { name: "Check-up da Tireoide", description: "Para avaliar a função da tireoide em pessoas com sintomas como fadiga, ganho ou perda de peso e alterações hormonais.", exams: ["T4 Livre", "TSH - Hormônio Tireoestimulante"] },
  { name: "Check-up do Colesterol", description: "Indicado para quem tem histórico de colesterol alto, obesidade ou fatores de risco cardiovascular.", exams: ["Colesterol Total", "Colesterol - HDL", "Colesterol - LDL", "Colesterol - VLDL", "Triglicerídeos"] },
  { name: "Check-up do Rim", description: "Para quem tem hipertensão, diabetes, histórico de problemas renais ou precisa monitorar a saúde dos rins.", exams: ["Cálcio", "Creatinina", "Fósforo", "Hemoglobina Glicada", "Hemograma", "Potássio", "Parcial de Urina", "Sódio", "Ureia"] },
  { name: "Check-up do Diabetes", description: "Recomendado para quem tem diagnóstico ou histórico familiar de diabetes, ou deseja avaliar o metabolismo da glicose.", exams: ["Cálcio", "Colesterol Total", "Colesterol - HDL", "Colesterol - LDL", "Creatinina", "Fósforo", "Glicose", "Hemoglobina Glicada", "Parcial de Urina", "Triglicerídeos"] },
  { name: "Check-up do Coração", description: "Voltado para pessoas com histórico de doenças cardíacas, hipertensão, colesterol alto ou fatores de risco cardiovascular.", exams: ["Colesterol Total", "Colesterol - HDL", "Colesterol - LDL", "Glicose em Jejum", "Hemoglobina Glicada", "Hemograma", "Proteína C Reativa Ultrassensível", "Triglicerídeos"] },
  { name: "Check-up de Vitaminas", description: "Ideal para quem apresenta cansaço, queda de imunidade, alimentação restritiva ou deseja avaliar vitaminas e minerais.", exams: ["Ácido Fólico", "Cálcio", "Ferro Sérico", "Fósforo", "Vitamina B12", "Vitamina D - 25 Hidroxi", "Vitamina C"] },
  { name: "Check-up dos Ossos", description: "Indicado para pessoas acima de 40 anos, menopausa, histórico de osteoporose ou queixas de dores ósseas.", exams: ["Cálcio", "Fosfatase Alcalina", "Fósforo", "PTH - Paratormônio", "TSH - Hormônio Tireoestimulante", "Vitamina D - 25 Hidroxi"] },
  { name: "Check-up do Fígado", description: "Para quem consome álcool regularmente, usa medicamentos contínuos ou tem histórico de alterações hepáticas.", exams: ["Amilase", "Bilirrubinas Totais e Frações", "Gama GT", "Hemograma", "Hepatite B - HBsAg", "Hepatite C - Anti HCV", "Fosfatase Alcalina", "Proteínas Totais e Frações", "TGO", "TGP"] },
  { name: "Check-up de Hipertensão", description: "Recomendado para pessoas com pressão alta, histórico familiar ou acompanhamento de risco cardiovascular.", exams: ["Colesterol Total", "Colesterol - HDL", "Colesterol - LDL", "Creatinina", "Glicose", "Hemograma", "Parcial de Urina", "Potássio", "Sódio", "Triglicerídeos"] },
  { name: "Check-up Anemia", description: "Indicado para quem sente fraqueza, fadiga, palidez ou possui suspeita de deficiência de ferro e vitaminas.", exams: ["Ácido Fólico", "Ferro Sérico", "Ferritina", "Hemograma", "Vitamina B12"] },
  { name: "Check-up Imunológico", description: "Ideal para quem apresenta infecções recorrentes, baixa imunidade ou deseja avaliar a resposta imunológica.", exams: ["Ácido Fólico", "Hemograma", "Imunoglobulina G - IgG", "Imunoglobulina M - IgM", "Imunoglobulina A - IgA", "Imunoglobulina E - IgE", "Vitamina B12", "Vitamina D", "Vitamina C"] },
  { name: "Check-up Início de Ano", description: "Indicado para quem deseja avaliar a saúde de forma ampla, prevenindo e monitorando possíveis alterações no organismo.", exams: ["Hemograma Completo", "Glicose", "Colesterol Total", "Colesterol HDL", "Colesterol LDL", "Triglicerídeos", "Creatinina", "Ureia", "Gama GT", "TGO", "TGP", "Ácido Úrico", "Sódio", "Potássio", "Proteína C Reativa Ultrassensível", "TSH", "Vitamina D", "Vitamina B12", "Parcial de Urina"] },
  { name: "Check-up Infantil", description: "Voltado para crianças, auxilia na detecção precoce de deficiências nutricionais, alterações hormonais e prevenção de doenças.", exams: ["Colesterol Total", "Colesterol - HDL", "Colesterol - LDL", "Creatinina", "Ferritina", "Ferro", "Glicose", "Hemograma", "Hemoglobina Glicada", "Parcial de Urina", "TGO", "Triglicerídeos", "TSH", "Vitamina B12", "Vitamina D"] },
  { name: "Check-up da Mulher", description: "Indicado para mulheres adultas em idade fértil, para acompanhamento geral da saúde metabólica, hormonal e cardiovascular.", exams: ["Hemograma", "Proteína C Reativa Ultrassensível", "Glicose", "Hemoglobina Glicada", "Colesterol Total", "Colesterol HDL", "Creatinina", "Gama GT", "Proteínas Totais e Frações", "TGO", "TGP", "Potássio", "Sódio", "TSH", "Vitamina D", "Parcial de Urina"] },
  { name: "Check-up da Mulher +40", description: "Para mulheres a partir dos 40 anos, com foco em alterações hormonais, saúde óssea, cardiovascular e prevenção.", exams: ["Cálcio Iônico", "Colesterol Total", "Colesterol HDL", "Colesterol LDL", "Creatinina", "Estradiol", "FSH", "Fósforo", "Fosfatase Alcalina", "Glicose", "Gama GT", "Hemoglobina Glicada", "Hemograma Completo", "Parcial de Urina"] },
  { name: "Check-up do Homem", description: "Voltado para homens adultos, avaliando saúde metabólica, cardiovascular e funcionamento geral do organismo.", exams: ["Colesterol Total", "Colesterol HDL", "Colesterol LDL", "Creatinina", "Gama GT", "Glicose", "Hemograma Completo", "Hemoglobina Glicada", "Parcial de Urina", "Potássio", "Proteína C Reativa Ultrassensível", "Proteínas Totais e Frações", "TGO", "TGP", "TSH", "Triglicerídeos", "Sódio", "Vitamina D - 25 Hidroxi"] },
  { name: "Check-up do Homem +40", description: "Indicado para homens a partir dos 40 anos, incluindo avaliação da próstata, hormônios e fatores de risco cardiovascular.", exams: ["Amilase", "Colesterol Total", "Colesterol HDL", "Colesterol LDL", "Creatinina", "Glicose", "Gama GT", "Hemograma", "Hemoglobina Glicada", "Proteínas Totais e Frações", "Potássio", "Parcial de Urina", "PSA Total", "PCR", "TGO", "TGP", "TSH", "Testosterona Total", "Triglicerídeos", "Sangue Oculto nas Fezes", "Sódio", "Vitamina D - 25 Hidroxi", "Vitamina B12"] },
  { name: "Check-up Jovem", description: "Recomendado para adolescentes e jovens adultos, ajudando a identificar riscos relacionados a estilo de vida, imunidade, fígado e saúde sexual.", exams: ["Ácido Úrico", "Amilase", "Bilirrubina", "Cortisol Basal", "Colesterol Total", "Colesterol HDL", "Colesterol LDL", "Colesterol VLDL", "Creatinina", "Ferritina", "FSH", "Fosfatase Alcalina", "Glicemia", "GGT", "Hemograma", "Hepatite B - Anti-HBs", "Hepatite B - HBsAg", "HIV", "HCV", "Parasitológico de Fezes", "Parcial de Urina", "Triglicerídeos", "TGO", "TGP", "TSH", "Sangue Oculto", "Ureia", "VDRL"] },
  { name: "Check-up Vegetariano", description: "Recomendado para pessoas que seguem dieta vegetariana ou vegana, auxiliando no monitoramento de nutrientes essenciais, vitaminas e minerais.", exams: ["Ácido Fólico", "Cálcio", "Colesterol Total", "Colesterol HDL", "Colesterol LDL", "Creatinina", "Fosfatase Alcalina", "Ferro Sérico", "Fósforo", "Glicose em Jejum", "Hemograma", "Hemoglobina Glicada", "Proteínas Totais e Frações", "TGP", "Triglicerídeos", "Ureia", "Vitamina B12", "Vitamina D - 25 Hidroxi", "Vitamina C"] },
  { name: "Check-up Saúde Sexual", description: "Indicado para pessoas sexualmente ativas que desejam realizar prevenção ou acompanhamento de infecções sexualmente transmissíveis, mesmo sem sintomas aparentes.", exams: ["DST-PCR Multiplex", "HBsAg", "HCV", "HIV", "Hemograma", "Parcial de Urina", "VDRL"] },
  { name: "Check-up Nutrição", description: "Indicado para avaliar hábitos alimentares, detectar deficiências de vitaminas e minerais e monitorar parâmetros metabólicos relacionados à nutrição e à saúde geral.", exams: ["Ácido Fólico", "ALT (TGP)", "AST (TGO)", "ATPO - Anticorpos Antitiroperoxidase", "Cálcio", "Creatinina", "Colesterol Total", "Colesterol HDL", "Colesterol LDL", "Ferritina", "Ferro", "Fosfatase Alcalina", "Gama GT", "Glicose", "Hemograma", "Hemoglobina Glicada", "Magnésio", "Parcial de Urina", "T4 Livre", "T4 Total", "Tireoglobulina", "Triglicerídeos", "TSH", "Ureia", "Vitamina B12", "Vitamina D", "Zinco"] },
  { name: "Check-up Alergia", description: "Recomendado para pessoas com sintomas de alergias respiratórias ou alimentares, histórico familiar de alergias ou que desejam identificar sensibilidades.", exams: ["Hemograma", "IgE Total", "IgE Específico F2 - Leite de Vaca", "IgE Específico F245 - Ovo", "IgE Específico F14 - Soja", "IgE Específico F4 - Trigo", "IgE Painel DX1 - Ácaros", "IgE Painel HX1 - Poeira", "IgE Painel TX4 - Pólens", "Epitélios/caspa de gato", "Epitélios/caspa de cachorro"] }
];

const services = [
  {
    icon: FlaskConical,
    title: "Exames laboratoriais",
    text: "Um catálogo completo para acompanhar diferentes necessidades de saúde."
  },
  {
    icon: HomeIcon,
    title: "Coleta domiciliar",
    text: "Consulte a disponibilidade para realizar a coleta no conforto da sua casa."
  },
  {
    icon: Baby,
    title: "Atendimento infantil",
    text: "Um atendimento acolhedor para tornar a experiência das crianças mais tranquila."
  },
  {
    icon: Microscope,
    title: "Tecnologia e precisão",
    text: "Processos e equipamentos pensados para entregar resultados confiáveis."
  }
];

function whatsappLink(message) {
  return `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(message)}`;
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousOverscroll;
    };
  }, [locked]);
}

function normalizeSearchText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatCPF(value = "") {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

const weekdayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
const monthLabels = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];

function formatDateBR(isoDate = "") {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [year, month] = value.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const pickerRef = useRef(null);

  useBodyScrollLock(open);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  const toIsoDate = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const selectDay = (day) => {
    if (!day) return;
    onChange(toIsoDate(day));
    setOpen(false);
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const isSelected = (day) => day && value === toIsoDate(day);
  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isPast = (day) => day && new Date(year, month, day) < today;

  return (
    <div className="schedule-date-field" ref={pickerRef}>
      <button
        type="button"
        className={`schedule-exam-trigger ${value ? "has-value" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{value ? formatDateBR(value) : "Selecione uma data"}</span>
        <CalendarDays size={17} />
      </button>

      {open && (
        <div className="schedule-date-popover" role="dialog" aria-label="Selecionar data">
          <div className="schedule-date-head">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior">
              <ChevronLeft size={17} />
            </button>
            <strong>{monthLabels[month]} de {year}</strong>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês">
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="schedule-date-weekdays">
            {weekdayLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>

          <div className="schedule-date-grid">
            {cells.map((day, index) => (
              <button
                type="button"
                key={index}
                disabled={!day || isPast(day)}
                className={`schedule-date-cell ${isSelected(day) ? "selected" : ""} ${isToday(day) ? "today" : ""}`}
                onClick={() => selectDay(day)}
              >
                {day || ""}
              </button>
            ))}
          </div>

          <div className="schedule-date-foot">
            <button
              type="button"
              className="schedule-date-link"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Limpar
            </button>
            <button
              type="button"
              className="schedule-date-link"
              onClick={() => {
                const now = new Date();
                setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
                onChange(
                  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
                );
                setOpen(false);
              }}
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


const routeTitles = {
  "/": "Início",
  "/sobre": "A EXATTA",
  "/exames": "Exames",
  "/servicos": "Serviços",
  "/perguntas-frequentes": "Perguntas Frequentes",
  "/agendamento": "Agendamento",
  "/contato": "Contato",
  "/lgpd": "LGPD"
};

function useRoute() {
  const getPath = () => {
    const path = window.location.pathname.replace(/\/+$/, "");
    return path || "/";
  };

  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to) => {
    if (to === window.location.pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return { path, navigate };
}

function Header({ navigate, path }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerFixed, setHeaderFixed] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderFixed(window.scrollY > 34);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const isActive = (target) => path === target || (target !== "/" && path.startsWith(`${target}/`));

  return (
    <>
      <div className="topbar">
        <div className="container topbar-content">
          <span>
            <Clock3 size={15} />
            Atendimento com horário agendado
          </span>

          <a href={`tel:${clinic.phone}`}>
            <Phone size={15} />
            {clinic.phone}
          </a>
        </div>
      </div>

      <header className={headerFixed ? "header header-fixed" : "header"}>
        <div className="container nav">
          <button
            className="brand"
            onClick={() => go("/")}
            aria-label="Voltar ao início"
          >
            <img
              src="/images/logo-exatta.png"
              alt="EXATTA Análises Clínicas"
            />
          </button>

          <nav className={menuOpen ? "nav-links open" : "nav-links"}>
            <button className={isActive("/") ? "nav-link active" : "nav-link"} onClick={() => go("/")}><span>Início</span></button>
            <button className={isActive("/sobre") ? "nav-link active" : "nav-link"} onClick={() => go("/sobre")}><span>A EXATTA</span></button>
            <button className={isActive("/exames") ? "nav-link active" : "nav-link"} onClick={() => go("/exames")}><span>Exames</span></button>
            <button className={isActive("/servicos") ? "nav-link active" : "nav-link"} onClick={() => go("/servicos")}><span>Serviços</span></button>
            <button className={isActive("/perguntas-frequentes") ? "nav-link active" : "nav-link"} onClick={() => go("/perguntas-frequentes")}><span>Perguntas Frequentes</span></button>
            <button className={isActive("/contato") ? "nav-link active" : "nav-link"} onClick={() => go("/contato")}><span>Contato</span></button>

            <a
              className="nav-results"
              href={clinic.resultsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              <FileText size={17} />
              Resultados
            </a>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {headerFixed && <div className="header-spacer" aria-hidden="true" />}
    </>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <img
            className="footer-logo"
            src="/images/logo-exatta.png"
            alt="EXATTA Análises Clínicas"
          />

          <p>
            Precisão, confiança e cuidado em cada etapa.
          </p>
        </div>

        <div>
          <h4>Navegação</h4>

          <button onClick={() => navigate("/")}>Início</button>
          <button onClick={() => navigate("/sobre")}>A EXATTA</button>
          <button onClick={() => navigate("/exames")}>Exames</button>
          <button onClick={() => navigate("/servicos")}>Serviços</button>
          <button onClick={() => navigate("/perguntas-frequentes")}>Perguntas Frequentes</button>
          <button onClick={() => navigate("/agendamento")}>Agendamento</button>
          <button onClick={() => navigate("/contato")}>Contato</button>
        </div>

        <div>
          <h4>Atendimento</h4>

          <a href={`tel:${clinic.phone}`}>
            <Phone size={15} />
            {clinic.phone}
          </a>

          <a href={`mailto:${clinic.email}`}>
            <Mail size={15} />
            {clinic.email}
          </a>

          {clinic.instagram ? (
            <a
              href={clinic.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={15} />
              Instagram
            </a>
          ) : null}

          <button onClick={() => navigate("/lgpd")}>
            Privacidade e LGPD
          </button>

        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © 2026 EXATTA Análises Clínicas. Todos os direitos reservados.
        </span>

        <span>
          Site desenvolvido por{' '}
          <a
            href="https://www.instagram.com/kz.tecnologia.ltda/"
            target="_blank"
            rel="noopener noreferrer"
          >
            KZ TECNOLOGIA LTDA.
          </a>
        </span>
      </div>
    </footer>
  );
}

function PageHero({ tag, title, text, image, badge = "EXATTA • ANÁLISES CLÍNICAS" }) {
  const imageData = {
    "/images/time-exatta-laboratorio.webp": {
      srcSet: "/images/time-exatta-laboratorio-960.webp 960w, /images/time-exatta-laboratorio-1440.webp 1440w, /images/time-exatta-laboratorio-2048.webp 2048w",
      sizes: "(max-width: 900px) 100vw, 46vw",
      width: 2048,
      height: 1365,
    },
    "/images/page-home-agendamento.webp": {
      srcSet: "/images/page-home-agendamento-720.webp 720w, /images/page-home-agendamento-1200.webp 1200w",
      sizes: "(max-width: 900px) 100vw, 46vw",
      width: 1200,
      height: 750,
    },
    "/images/page-home-contato.webp": {
      srcSet: "/images/page-home-contato-960.webp 960w, /images/page-home-contato-1600.webp 1600w",
      sizes: "(max-width: 900px) 100vw, 46vw",
      width: 1600,
      height: 800,
    },
    "/images/page-hero-exames.webp": {
      srcSet: "/images/page-hero-exames-640.webp 640w, /images/page-hero-exames-848.webp 848w",
      sizes: "(max-width: 900px) 100vw, 46vw",
      width: 848,
      height: 566,
    },
    "/images/page-home-servicos.webp": {
      srcSet: "/images/page-home-servicos-960.webp 960w, /images/page-home-servicos-1536.webp 1536w",
      sizes: "(max-width: 900px) 100vw, 46vw",
      width: 1536,
      height: 1024,
    },
    "/images/page-home-cuida-de-voce.webp": {
      srcSet: "/images/page-home-cuida-de-voce-700.webp 700w, /images/page-home-cuida-de-voce-900.webp 900w",
      sizes: "(max-width: 900px) 100vw, 46vw",
      width: 900,
      height: 900,
    },
  }[image] || {};

  const altByTag = {
    "A EXATTA": "Equipe da EXATTA no laboratório",
    AGENDAMENTO: "Agendamento de atendimento da EXATTA",
    CONTATO: "Informações de contato da EXATTA",
    EXAMES: "Tubos de coleta e amostras para exames laboratoriais",
    SERVIÇOS: "Profissionais da EXATTA em laboratório",
    PRIVACIDADE: "Profissional analisando amostras em laboratório",
  };

  const artByTag = {
    "A EXATTA": "sobre",
    AGENDAMENTO: "agendamento",
    CONTATO: "contato",
    EXAMES: "exames",
    SERVIÇOS: "servicos",
    PRIVACIDADE: "lgpd",
  };

  return (
    <section className={`page-hero art-${artByTag[tag] || "sobre"}`}>
      <div className="container page-hero-layout">
        <div className="page-hero-content">
          <div className="section-tag">{tag}</div>
          <h1>{title}</h1>
          {text ? <p>{text}</p> : null}
          <div className="page-hero-badge"><span />{badge}</div>
        </div>
        <div className="page-hero-visual">
          <img
            src={image}
            srcSet={imageData.srcSet}
            sizes={imageData.sizes}
            width={imageData.width}
            height={imageData.height}
            alt={altByTag[tag] || "Imagem da EXATTA Análises Clínicas"}
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
          <div className="page-hero-glass">
            <Microscope size={18} />
            <span>Precisão em cada etapa</span>
          </div>
          <div className="page-hero-ring" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
function LabBackdrop() {
  return null;
}

function AnimatedStat({ value, label, delay = 0 }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  const match = String(value).match(/^(\+?)(\d+)(.*)$/);
  const prefix = match ? match[1] : "";
  const target = match ? Number(match[2]) : 0;
  const suffix = match ? match[3] : String(value);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    let frameId;
    let timeoutId;
    const duration = 1500;
    const startTime = performance.now();
    const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);

    const animate = (now) => {
      const elapsed = Math.min(now - startTime, duration);
      const progress = elapsed / duration;
      setDisplayValue(Math.round(target * easeOut(progress)));

      if (elapsed < duration) {
        frameId = requestAnimationFrame(animate);
      }
    };

    timeoutId = window.setTimeout(() => {
      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [started, target, delay]);

  return (
    <div className={`stat-item${started ? " is-counting" : ""}`} ref={ref}>
      <strong aria-label={value}>
        {prefix}{displayValue}{suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

function Home({ navigate, selectedExams, onToggleExam }) {
  const quickLinks = [
    {
      icon: Search,
      title: "ENCONTRE SEU EXAME",
      text: "Pesquise em nosso catálogo",
      path: "/exames"
    },
    {
      icon: FileText,
      title: "RESULTADOS ONLINE",
      text: "Acesse seus resultados com segurança",
      external: clinic.resultsUrl
    },
    {
      icon: CalendarCheck,
      title: "AGENDAMENTO",
      text: "Escolha o melhor horário para você",
      path: "/agendamento"
    }
  ];

  const stats = [
    ["+10 mil", "Atendimentos realizados mensalmente"],
    ["+4000", "Exames disponíveis"],
    ["24h", "Acesso aos resultados"],
    ["100%", "Compromisso com você"]
  ];

  const homeExams = exams.slice(0, 6);

  const strengths = [
    {
      icon: Microscope,
      title: "Precisão",
      text: "Processos e tecnologia pensados para apoiar resultados confiáveis."
    },
    {
      icon: Award,
      title: "Tecnologia",
      text: "Estrutura digital moderna para facilitar cada etapa do atendimento."
    },
    {
      icon: ShieldCheck,
      title: "Segurança",
      text: "Cuidado com informações, acesso aos resultados e privacidade."
    },
    {
      icon: HeartPulse,
      title: "Atendimento humanizado",
      text: "Uma experiência mais acolhedora, clara e próxima do paciente."
    }
  ];

  return (
    <div className="home-page">
      <section className="hero hero-photo" id="inicio">
        <img
          className="hero-bg-img"
          src="/images/exatta-microscopio.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
        />
        <div className="hero-bg-overlay" aria-hidden="true" />
        <DnaBackground />

        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              Exatta • Análises Clínicas
            </div>

            <h1>
              <span className="hero-line-text">
                <span className="hl-green">E</span>xames
              </span>
              <span className="hero-line-text">laboratoriais com</span>
              <span className="hero-line-text hero-line-soft">confiança e cuidado.</span>
            </h1>

            <p>
              Tecnologia, precisão e atendimento próximo para cuidar de você em
              cada etapa — da coleta ao resultado.
            </p>

            <div className="hero-actions">
              <button
                className="button primary"
                onClick={() => navigate("/agendamento")}
              >
                Agendar exame
                <ArrowRight size={18} />
              </button>

              <button
                className="button hero-link"
                onClick={() => navigate("/exames")}
              >
                Conhecer exames
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="trust-row">
              <div>
                <ShieldCheck size={16} />
                <span>Segurança</span>
              </div>
              <div>
                <Award size={16} />
                <span>Qualidade</span>
              </div>
              <div>
                <HeartPulse size={16} />
                <span>Cuidado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container hero-corner">
          <span className="hero-location">Rio Negrinho • SC</span>
          <a
            className="hero-pncq-seal"
            href="https://pncq.org.br/o-programa/como-funciona-o-pncq/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Saiba mais sobre o PNCQ — Programa Nacional de Controle de Qualidade"
          >
            <img
              src="/images/pncq.png"
              alt="PNCQ — Programa Nacional de Controle de Qualidade"
            />
          </a>
        </div>
      </section>

      <section className="quick-access">
        <div className="container quick-grid">
          {quickLinks.map(({ icon: Icon, title, text, path, external }) => (
            <button
              key={path || external}
              onClick={() =>
                external
                  ? window.open(external, "_blank", "noopener,noreferrer")
                  : navigate(path)
              }
            >
              <span className="quick-icon">
                <Icon size={22} />
              </span>

              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>

              <ArrowRight size={18} />
            </button>
          ))}
        </div>
      </section>

      <section className="home-exams-section">
        <div className="container">
          <div className="section-heading centered">
            <div className="section-tag">EXAMES</div>
            <h2>Encontre o exame que você procura</h2>
            <p>
              Consulte o catálogo de exames da EXATTA e veja informações introdutórias sobre cada opção.
            </p>
          </div>

          <div className="exam-grid home-exam-grid">
            {homeExams.map((exam) => (
              <article
                className={`exam-card ${selectedExams.includes(exam.name) ? "exam-card-selected" : ""}`}
                key={`${exam.category}-${exam.name}`}
              >
                <div className="exam-icon">
                  <FlaskConical size={20} />
                </div>

                <span>{exam.category}</span>

                <h3>{exam.name}</h3>

                {exam.synonyms?.length ? (
                  <div className="exam-card-synonyms" aria-label="Sinônimos do exame">
                    {exam.synonyms.slice(0, 2).map((term) => (
                      <span key={term}>{term}</span>
                    ))}
                    {exam.synonyms.length > 2 ? (
                      <span className="exam-card-synonyms-more">+{exam.synonyms.length - 2}</span>
                    ) : null}
                  </div>
                ) : null}

                <div className="exam-card-actions">
                  <button
                    className={`exam-cart-button ${selectedExams.includes(exam.name) ? "selected" : ""}`}
                    onClick={() => onToggleExam(exam.name)}
                    type="button"
                    aria-pressed={selectedExams.includes(exam.name)}
                  >
                    <ShoppingCart size={15} />
                    {selectedExams.includes(exam.name) ? "Adicionado" : "Adicionar"}
                  </button>

                  <button
                    className="exam-more-button"
                    onClick={() => navigate("/exames")}
                    type="button"
                  >
                    Saber mais
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="home-exams-action">
            <button
              className="button primary"
              type="button"
              onClick={() => navigate("/exames")}
            >
              Ver todos os exames
              <ArrowRight size={17} />
              
            </button>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map(([number, label], index) => (
            <AnimatedStat
              key={label}
              value={number}
              label={label}
              delay={index * 120}
            />
          ))}
        </div>
      </section>

      <section className="section about">
        <div className="container about-grid">
          <div className="about-visual">
            <div className="section-tag">A EXATTA</div>
            <div className="about-doctor-photo">
              <img
                src="/images/medico-exatta.webp"
                alt="Profissional da EXATTA analisando amostras em laboratório"
              />
            </div>
          </div>

          <div>
            <h2>

                Cuidamos de cada etapa do seu Atendimento    
            </h2>       
            <p className="lead">
              Da coleta à entrega do resultado, nossa equipe trabalha para oferecer um atendimento tranquilo, seguro e próximo.
            </p>

            <div className="about-points">
              <div>
                <CheckCircle2 />
                <span>COLETA Procedimento realizado com segurança.</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>ANÁLISE Exames com controle de qualidade.</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>RESULTADO Acesse seus resultados de forma online.</span>
              </div>
            </div>

            <button
              className="button secondary page-inline-button"
              onClick={() => navigate("/sobre")}
            >
              Conheça a EXATTA
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="container">
          <div className="section-heading centered">
            <div className="section-tag">POR QUE ESCOLHER A EXATTA?</div>
            <h2>Confiança construída em cada detalhe.</h2>
            <p>
              Tecnologia, segurança e cuidado para transformar uma etapa
              importante da sua rotina em uma experiência mais tranquila.
            </p>
          </div>

          <div className="why-grid">
            {strengths.map(({ icon: Icon, title, text }) => (
              <article className="why-card" key={title}>
                <div className="why-icon">
                  <Icon size={25} />
                </div>
                <span className="why-number">
                  {String(strengths.findIndex((item) => item.title === title) + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-story-section">
        <div className="container lab-story-grid">
          <div className="lab-story-copy">
            <div className="section-tag">TECNOLOGIA E CUIDADO</div>
            <h2>Um laboratório preparado para cuidar do que realmente importa.</h2>
            <p className="lead">
              Cada detalhe da experiência EXATTA foi pensado para unir
              precisão técnica, clareza e acolhimento — do primeiro contato
              ao acesso aos seus resultados.
            </p>

            <div className="lab-story-points">
              <div>
                <CheckCircle2 size={18} />
                <span>Ambiente organizado e moderno</span>
              </div>
              <div>
                <CheckCircle2 size={18} />
                <span>Informações simples e acessíveis</span>
              </div>
              <div>
                <CheckCircle2 size={18} />
                <span>Atendimento pensado para você</span>
              </div>
            </div>
          </div>

          <div className="lab-photo-collage">
            <figure className="lab-photo-main">
              <img
                src="/images/hero-profissional-exatta.webp"
                alt="Profissional analisando amostras em laboratório"
              />
              <figcaption>
                <Microscope size={17} />
                Profissional com formação em Microbiologia
              </figcaption>
            </figure>

            <figure className="lab-photo-small">
              <img
                src="/images/page-coleta.webp"
                alt="Tubos de coleta de sangue para análise laboratorial"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="section services">
        <div className="container">
          <div className="section-heading">
            <div className="section-tag">SERVIÇOS</div>

            <h2>Mais praticidade para cuidar de você</h2>

            <p>
              Conheça as soluções e formas de atendimento disponíveis na EXATTA.
            </p>
          </div>

          <div className="service-grid">
            {services.map(({ icon: Icon, title, text }) => (
              <button
                className="service-card service-card-button"
                key={title}
                onClick={() => navigate("/servicos")}
              >
                <div className="service-icon">
                  <Icon size={25} />
                </div>

                <h3>{title}</h3>

                <p>{text}</p>

                <ArrowRight
                  size={18}
                  className="service-arrow service-arrow-right"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="result-section">
        <div className="container result-card">
          <div className="result-copy">
            <div className="section-tag light">RESULTADOS ONLINE</div>

            <h2>Consulte seus resultados com segurança.</h2>

            <p>
              Acesse o portal oficial de resultados da EXATTA para consultar
              seus exames em um ambiente externo e seguro.
            </p>
          </div>

          <div className="result-form">
            <div className="result-access-box">
              <div className="result-access-header">
                <div className="result-access-icon">
                  <FileText size={21} />
                </div>

                <div className="result-access-title">
                  <span>PORTAL OFICIAL WORKLAB</span>
                  <strong>Acesso aos seus exames</strong>
                </div>
              </div>

              <p>
                Consulte seus resultados diretamente no portal seguro da EXATTA.
              </p>

              <a
                className="result-access-button"
                href={clinic.resultsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar resultados
                <span className="result-access-arrow">
                  <ArrowRight size={17} />
                </span>
              </a>

              <div className="result-access-security">
                <ShieldCheck size={15} />
                <span>
                  A chave e a senha são utilizadas somente no portal.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact">
        <div className="container contact-grid">
          <div>
            <div className="section-tag">CONTATO</div>

            <h2>Estamos prontos para atender você.</h2>

            <p className="lead">
              Entre em contato para tirar dúvidas, consultar exames
              ou agendar seu atendimento.
            </p>

            <div className="contact-list">
              <a href={`tel:${clinic.phone}`}>
                <span>
                  <Phone />
                </span>
                <div>
                  <small>Telefone</small>
                  <strong>{clinic.phone}</strong>
                </div>
              </a>

              <a
                className="contact-whatsapp"
                href={whatsappLink(
                  "Olá, gostaria de falar com a EXATTA pelo WhatsApp."
                )}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-item-icon">
                  <MessageCircle />
                </span>
                <div className="contact-item-content">
                  <small>WhatsApp</small>
                  <strong>{clinic.whatsappDisplay}</strong>
                </div>
              </a>

              <a href={`mailto:${clinic.email}`}>
                <span>
                  <Mail />
                </span>
                <div>
                  <small>E-mail</small>
                  <strong>{clinic.email}</strong>
                </div>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  clinic.address
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <MapPin />
                </span>
                <div>
                  <small>Endereço</small>
                  <strong>{clinic.address}</strong>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-panel">
            <div className="panel-icon">
              <Stethoscope />
            </div>

            <h3>Agende pelo WhatsApp</h3>

            <p>
              Converse com a nossa equipe e receba orientações sobre exames,
              preparo e horários.
            </p>

            <button
              className="button primary full"
              onClick={() => navigate("/agendamento")}
            >
              Ver opções de agendamento
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


const teamMembers = [
  {
    name: "Lucas",
    role: "Biomédico e CEO",
    image: "/images/team/lucas.webp",
    description:
      "Fundador e diretor técnico da EXATTA, à frente da visão de qualidade, precisão e inovação que guia o laboratório.",
  },
  {
    name: "Patrícia",
    role: "Enfermeira",
    image: "/images/team/patricia.webp",
    description:
      "Responsável pela coleta e pelo cuidado direto com o paciente, com atenção e acolhimento em cada atendimento.",
  },
  {
    name: "Stelimar",
    role: "Técnica em Enfermagem",
    image: "/images/team/stelimar.webp",
    description:
      "Atua na coleta e no suporte aos pacientes, garantindo conforto, segurança e agilidade em cada etapa.",
  },
  {
    name: "Alanis",
    role: "Biomédica",
    image: "/images/team/alanis.webp",
    description:
      "Atua com dedicação técnica para garantir exames precisos, seguros e confiáveis.",
  },
  {
    name: "Rodrigo",
    role: "Biomédico",
    image: "/images/team/rodrigo.webp",
    description:
      "Dedicado à execução dos exames com atenção aos detalhes e compromisso com resultados confiáveis.",
  },
  {
    name: "Maria",
    role: "Biomédica",
    image: "/images/team/maria.webp",
    description:
      "Atua com dedicação técnica para garantir exames precisos, seguros e confiáveis.",
  },
];

function TeamSection() {
  return (
    <section className="section team-section">
      <div className="container">
        <div className="team-section-head">
          <div className="section-tag">NOSSA EQUIPE</div>
          <h2>Profissionais dedicados a cuidar de você.</h2>
          <p className="lead">
            Conheça a equipe que une técnica, precisão e acolhimento em cada
            etapa do atendimento na EXATTA.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <article className="team-card" key={member.name}>
              <div className={`team-card-photo ${member.name === "Lucas" || member.name === "Rodrigo" ? "team-card-photo--upper-body" : ""}`}>
                <img src={member.image} alt={`${member.name} - ${member.role}`} loading="lazy" decoding="async" />
              </div>
              <div className="team-card-body">
                <h3>{member.name}</h3>
                <span className="team-role-badge">{member.role}</span>
                <p>{member.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage({ navigate }) {
  return (
    <>
      <LabBackdrop />
      <PageHero
        tag="A EXATTA"
        title="Excelência em análises clínicas com um olhar humano."
        text="Conheça a proposta da EXATTA, nossa visão de atendimento e a tecnologia por trás de uma experiência mais segura e acolhedora."
        image="/images/time-exatta-laboratorio.webp"
      />

      <section className="section about">
        <div className="container content-page-grid">
          <div>
            <div className="section-tag">NOSSO PROPÓSITO</div>
            <h2>Precisão, acolhimento e informação clara.</h2>
          </div>

          <div>
            <p className="lead">
              A EXATTA nasce com o propósito de unir precisão,
              acolhimento e tecnologia para oferecer uma experiência
              mais segura em cada exame.
            </p>

            <div className="about-points about-points-page">
              <div>
                <CheckCircle2 />
                <span>Atendimento próximo e responsável</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Processos focados em qualidade</span>
              </div>

              <div>
                <CheckCircle2 />
                <span>Informação clara para o paciente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-story-section">
        <div className="container about-story-grid">
          <div className="about-story-photo">
            <img src="/images/page-home-nossa-identidade.webp" alt="Profissional em ambiente de laboratório" />
            <div className="about-photo-badge"><ShieldCheck size={17} /><span>Qualidade e segurança</span></div>
          </div>
          <div className="about-story-copy">
            <div className="section-tag">NOSSA IDENTIDADE</div>
            <h2>Uma experiência pensada para transmitir confiança desde o primeiro contato.</h2>
            <p className="lead">
              A identidade da EXATTA combina tecnologia, organização e acolhimento. O objetivo é tornar cada etapa mais clara para o paciente, sem abrir mão da precisão que um laboratório exige.
            </p>
            <div className="identity-points">
              <div><span>01</span><div><strong>Precisão</strong><p>Processos organizados e foco na qualidade.</p></div></div>
              <div><span>02</span><div><strong>Clareza</strong><p>Informações simples para decisões mais tranquilas.</p></div></div>
              <div><span>03</span><div><strong>Acolhimento</strong><p>Uma jornada mais humana em cada atendimento.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

      <section className="section page-soft">
        <div className="container info-cards-grid">
          <article className="info-card">
            <ShieldCheck size={26} />
            <h3>Segurança</h3>
            <p>
              Informações e orientações apresentadas de forma clara,
              respeitando a privacidade do paciente.
            </p>
          </article>

          <article className="info-card">
            <Award size={26} />
            <h3>Qualidade</h3>
            <p>
              Uma experiência digital organizada para facilitar o acesso
              aos exames, serviços e canais de atendimento.
            </p>
          </article>

          <article className="info-card">
            <HeartPulse size={26} />
            <h3>Cuidado</h3>
            <p>
              Um atendimento pensado para reduzir dúvidas e tornar
              cada etapa mais simples.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container page-cta">
          <div>
            <div className="section-tag">PRÓXIMO PASSO</div>
            <h2>Quer consultar um exame?</h2>
            <p>
              Acesse o catálogo da EXATTA ou fale diretamente com nossa equipe.
            </p>
          </div>

          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() => navigate("/exames")}
            >
              Ver exames
              <ArrowRight size={17} />
            </button>

            <button
              className="button secondary"
              onClick={() => navigate("/contato")}
            >
              Entrar em contato
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function ExamsPage({ navigate, selectedExams, onToggleExam, onToggleBattery }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedBatteryInfo, setSelectedBatteryInfo] = useState(null);
  const [showAllExams, setShowAllExams] = useState(false);

  const examGridRef = useRef(null);
  const examSectionRef = useRef(null);

  useBodyScrollLock(Boolean(selectedExam || selectedBatteryInfo));

  const filteredExams = useMemo(() => {
    const normalized = normalizeSearchText(query);

    return exams.filter((exam) => {
      const matchesCategory =
        selectedCategory === "Todos" ||
        exam.category === selectedCategory;

      const matchesQuery =
        !normalized ||
        normalizeSearchText(exam.name).includes(normalized) ||
        normalizeSearchText(exam.category).includes(normalized) ||
        exam.synonyms.some((term) => normalizeSearchText(term).includes(normalized));

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const visibleExams = showAllExams
    ? filteredExams
    : filteredExams.slice(0, 8);

  const handleExamToggle = () => {
    if (showAllExams) {
      setShowAllExams(false);

      window.setTimeout(() => {
        examGridRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 60);
      return;
    }

    setShowAllExams(true);
  };

  const handleBackToExamsTop = () => {
    setShowAllExams(false);

    window.setTimeout(() => {
      examSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 60);
  };

  return (
    <>
      <LabBackdrop />
      <PageHero
        tag="EXAMES"
        title="Encontre o exame que você procura."
        text="Pesquise pelo nome, explore categorias e conheça as opções disponíveis no catálogo da EXATTA."
        image="/images/page-hero-exames.webp"
        badge="CATÁLOGO • EXAMES LABORATORIAIS"
      />

      <section className="section exams" ref={examSectionRef}>
        <div className="container">
          <div className="exam-search">
            <Search size={20} />

            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowAllExams(false);
              }}
              placeholder="Ex.: hemograma, glicemia, TSH..."
              aria-label="Pesquisar exames"
            />

            {query ? (
              <button onClick={() => setQuery("")} aria-label="Limpar busca">
                <X size={18} />
              </button>
            ) : null}
          </div>

          <div
            className="exam-category-list"
            aria-label="Categorias de exames"
          >
            {examCategories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowAllExams(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="exam-results-meta">
            <strong>{filteredExams.length}</strong>{" "}
            exames encontrados
            {selectedCategory !== "Todos"
              ? ` em ${selectedCategory}`
              : ""}
          </div>

          <div className="exam-grid" ref={examGridRef}>
            {visibleExams.map((exam) => (
              <article
                className={`exam-card ${selectedExams.includes(exam.name) ? "exam-card-selected" : ""}`}
                key={`${exam.category}-${exam.name}`}
              >
                <div className="exam-icon">
                  <FlaskConical size={20} />
                </div>

                <span>{exam.category}</span>

                <h3>{exam.name}</h3>

                {exam.synonyms?.length ? (
                  <div className="exam-card-synonyms" aria-label="Sinônimos do exame">
                    {exam.synonyms.slice(0, 2).map((term) => (
                      <span key={term}>{term}</span>
                    ))}
                    {exam.synonyms.length > 2 ? (
                      <span className="exam-card-synonyms-more">+{exam.synonyms.length - 2}</span>
                    ) : null}
                  </div>
                ) : null}

                <div className="exam-card-actions">
                  <button
                    className={`exam-cart-button ${selectedExams.includes(exam.name) ? "selected" : ""}`}
                    onClick={() => onToggleExam(exam.name)}
                    type="button"
                    aria-pressed={selectedExams.includes(exam.name)}
                  >
                    <ShoppingCart size={15} />
                    {selectedExams.includes(exam.name) ? "Adicionado" : "Adicionar"}
                  </button>

                  <button
                    className="exam-more-button"
                    onClick={() => setSelectedExam(exam)}
                    type="button"
                  >
                    Saber mais
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredExams.length > 8 ? (
            <div className="exam-expand-wrap">
              <button
                className="exam-expand-button"
                type="button"
                onClick={handleExamToggle}
                aria-expanded={showAllExams}
              >
                {showAllExams ? "Mostrar menos" : "..."}
              </button>

              <span>
                {showAllExams
                  ? "Clique para recolher a lista de exames."
                  : `Mostrando 8 de ${filteredExams.length} exames.`}
              </span>
            </div>
          ) : null}

          {filteredExams.length === 0 ? (
            <div className="empty-search">
              <Search size={30} />
              <h3>Não encontramos esse exame.</h3>
              <p>
                Fale com a equipe da EXATTA para verificar a disponibilidade.
              </p>
            </div>
          ) : null}

          <div className="batteries-block">
            <div className="batteries-heading">
              <div className="section-tag">COMBOS / BATERIAS</div>

              <h3>Opções de exames por objetivo</h3>

              <p>
                Check-ups completos para cada perfil.
                A disponibilidade e a composição devem ser confirmadas pela EXATTA.
              </p>
            </div>

            <div className="battery-grid">
              {examBatteries.map((battery) => {
                const isSelected = selectedExams.includes(battery.name);

                return (
                  <article
                    className={`battery-card ${isSelected ? "selected" : ""}`}
                    key={battery.name}
                  >
                    <div className="battery-icon">
                      <FlaskConical size={20} />
                    </div>

                    <h4>{battery.name}</h4>

                    <p>{battery.description}</p>

                    <div className="battery-exams">
                      {battery.exams.slice(0, 5).map((examName) => (
                        <span key={examName}>{examName}</span>
                      ))}

                      {battery.exams.length > 5 ? (
                        <span>+{battery.exams.length - 5} exames</span>
                      ) : null}
                    </div>

                    <div className="battery-card-actions">
                      <button
                        className="battery-select"
                        onClick={() => onToggleBattery(battery)}
                      >
                        {isSelected ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}

                        <CheckCircle2 size={16} />
                      </button>

                      <button
                        className="exam-more-button"
                        onClick={() => setSelectedBatteryInfo(battery)}
                        type="button"
                      >
                        Saber mais
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {showAllExams ? (
        <button
          className="back-to-exams-top"
          type="button"
          onClick={handleBackToExamsTop}
          aria-label="Voltar ao início da seção de exames"
        >
          <ArrowUp size={18} />
        </button>
      ) : null}

      {selectedExam ? (
        <div
          className="exam-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedExam(null);
            }
          }}
        >
          <div
            className="exam-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exam-modal-title"
          >
            <button
              className="exam-modal-close"
              type="button"
              onClick={() => setSelectedExam(null)}
              aria-label="Fechar informações do exame"
            >
              <X size={20} />
            </button>

            <div className="exam-modal-icon">
              <FlaskConical size={24} />
            </div>

            <span className="exam-modal-category">
              {selectedExam.category}
            </span>

            <h3 id="exam-modal-title">{selectedExam.name}</h3>

            <div className="exam-modal-content">
              <h4>Sobre o exame</h4>

              <p>{selectedExam.description}</p>

              <div className="exam-modal-details">
                <div>
                  <strong>Amostra</strong>
                  <span>{selectedExam.sample || "Consultar a EXATTA."}</span>
                </div>
                <div>
                  <strong>Preparo</strong>
                  <span>{selectedExam.preparation || "Consultar a EXATTA antes da coleta."}</span>
                </div>
              </div>

              {selectedExam.synonyms?.length ? (
                <div className="exam-modal-synonyms">
                  <strong>Também pode ser pesquisado como</strong>
                  <div>
                    {selectedExam.synonyms.map((term) => (
                      <span key={term}>{term}</span>
                    ))}
                  </div>
                </div>
              ) : null}

              <p>
                As informações apresentadas são as fornecidas no catálogo da EXATTA.
                O preparo definitivo e a interpretação dos resultados devem seguir a orientação
                da equipe do laboratório e do profissional de saúde responsável.
              </p>
            </div>

            <div className="exam-modal-note">
              <ShieldCheck size={18} />

              <span>
                Consulte a EXATTA sobre disponibilidade, preparo e orientações
                específicas antes da realização.
              </span>
            </div>

            <div className="exam-modal-actions">
              <button
                className={`exam-modal-action ${selectedExams.includes(selectedExam.name) ? "selected" : ""}`}
                type="button"
                onClick={() => onToggleExam(selectedExam.name)}
              >
                <ShoppingCart size={17} />
                {selectedExams.includes(selectedExam.name)
                  ? "Remover do carrinho"
                  : "Adicionar ao carrinho"}
              </button>

              <button
                className="exam-modal-secondary"
                type="button"
                onClick={() => setSelectedExam(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedBatteryInfo ? (
        <div
          className="exam-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBatteryInfo(null);
            }
          }}
        >
          <div
            className="exam-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="battery-modal-title"
          >
            <button
              className="exam-modal-close"
              type="button"
              onClick={() => setSelectedBatteryInfo(null)}
              aria-label="Fechar informações do checkup"
            >
              <X size={20} />
            </button>

            <div className="exam-modal-icon">
              <FlaskConical size={24} />
            </div>

            <span className="exam-modal-category">
              Combo / Bateria
            </span>

            <h3 id="battery-modal-title">{selectedBatteryInfo.name}</h3>
            <div className="exam-modal-content">
              <h4>Sobre o checkup</h4>

              <p>{selectedBatteryInfo.description}</p>

              <div className="exam-modal-synonyms">
                <strong>Exames incluídos</strong>
                <div>
                  {selectedBatteryInfo.exams.map((examName) => (
                    <span key={examName}>{examName}</span>
                  ))}
                </div>
              </div>

              <p>
                As informações apresentadas são as fornecidas no catálogo da EXATTA.
                A composição, o preparo e a disponibilidade deste checkup devem ser
                confirmados com a equipe do laboratório antes da realização.
              </p>
            </div>

            <div className="exam-modal-note">
              <ShieldCheck size={18} />

              <span>
                Consulte a EXATTA sobre disponibilidade, preparo e valores
                antes da confirmação deste checkup.
              </span>
            </div>

            <div className="exam-modal-actions">
              <button
                className={`exam-modal-action ${
                  selectedExams.includes(selectedBatteryInfo.name) ? "selected" : ""
                }`}
                type="button"
                onClick={() => onToggleBattery(selectedBatteryInfo)}
              >
                <ShoppingCart size={17} />
                {selectedExams.includes(selectedBatteryInfo.name)
                  ? "Remover do carrinho"
                  : "Adicionar ao carrinho"}
              </button>

              <button
                className="exam-modal-secondary"
                type="button"
                onClick={() => setSelectedBatteryInfo(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ServicesPage({ navigate }) {
  const serviceDetails = [
    {
      icon: FlaskConical,
      title: "Exames laboratoriais",
      text: "Consulte o catálogo de exames e encontre informações introdutórias sobre diferentes análises.",
      action: "Consultar exames",
      path: "/exames"
    },
    {
      icon: HomeIcon,
      title: "Coleta domiciliar",
      text: "Consulte com a equipe a disponibilidade desse atendimento, regiões atendidas e orientações.",
      action: "Consultar disponibilidade",
      path: "/agendamento"
    },
    {
      icon: Baby,
      title: "Atendimento infantil",
      text: "Informações sobre atendimento e orientações específicas podem ser confirmadas diretamente com a equipe.",
      action: "Falar com a equipe",
      path: "/contato"
    },
    {
      icon: Microscope,
      title: "Tecnologia e precisão",
      text: "Uma apresentação digital organizada para facilitar o acesso do paciente às informações do laboratório.",
      action: "Conhecer a EXATTA",
      path: "/sobre"
    }
  ];

  return (
    <>
      <LabBackdrop />
      <PageHero
        tag="SERVIÇOS"
        title="Serviços pensados para facilitar seu atendimento."
        text="Do exame à coleta, a EXATTA organiza diferentes formas de atendimento para deixar sua jornada mais simples."
        image="/images/page-home-servicos.webp"
        badge="ATENDIMENTO • PRATICIDADE E CUIDADO"
      />

      <section className="section services">
        <div className="container">
          <div className="service-page-grid">
            {serviceDetails.map(
              ({ icon: Icon, title, text, action, path }) => (
                <article className="service-detail-card" key={title}>
                  <div className="service-icon">
                    <Icon size={25} />
                  </div>

                  <h2>{title}</h2>

                  <p>{text}</p>

                  <button
                    className="button secondary"
                    onClick={() => navigate(path)}
                  >
                    {action}
                    <ArrowRight size={17} />
                  </button>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section service-experience-section">
        <div className="container service-experience-grid">
          <div className="service-experience-copy">
            <div className="section-tag">COMO A EXATTA CUIDA DE VOCÊ</div>
            <h2>Mais do que exames: uma jornada mais simples.</h2>
            <p className="lead">Do primeiro contato ao resultado, organizamos os principais pontos da experiência para que você encontre informação e atendimento com menos atrito.</p>
            <div className="service-timeline">
              <div><span>01</span><strong>Escolha seu exame</strong><small>Encontre informações no catálogo.</small></div>
              <div><span>02</span><strong>Agende seu atendimento</strong><small>Envie uma solicitação pelo WhatsApp.</small></div>
              <div><span>03</span><strong>Realize sua coleta</strong><small>Conte com uma experiência organizada.</small></div>
              <div><span>04</span><strong>Acesse seu resultado</strong><small>Consulte o portal oficial.</small></div>
            </div>
          </div>
          <div className="service-experience-visual">
            <img src="/images/page-home-cuida-de-voce.webp" alt="Profissional em atendimento por vídeo" />
            <div className="service-visual-card"><Microscope size={20}/><strong>Tecnologia + cuidado</strong><span>Uma experiência mais completa para o paciente.</span></div>
          </div>
        </div>
      </section>

      <section className="section page-soft">
        <div className="container page-cta">
          <div>
            <div className="section-tag">ATENDIMENTO</div>
            <h2>Precisa confirmar um serviço?</h2>
            <p>
              Nossa equipe pode informar disponibilidade, horários e orientações.
            </p>
          </div>

          <a
            className="button primary"
            href={whatsappLink(
              "Olá, gostaria de informações sobre os serviços da EXATTA."
            )}
            target="_blank"
            rel="noreferrer"
          >
            Falar pelo WhatsApp
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </>
  );
}

function SchedulingPage({ selectedExams, onToggleExam, onClearExams }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cpf: "",
    service: "",
    exams: selectedExams,
    checkups: [],
    date: "",
    message: ""
  });
  const [examPickerOpen, setExamPickerOpen] = useState(false);
  const [checkupPickerOpen, setCheckupPickerOpen] = useState(false);
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [examSearch, setExamSearch] = useState("");
  const [checkupSearch, setCheckupSearch] = useState("");
  const examPickerRef = useRef(null);
  const checkupPickerRef = useRef(null);
  const servicePickerRef = useRef(null);

  useBodyScrollLock(examPickerOpen || checkupPickerOpen || servicePickerOpen);

  const availableExams = useMemo(() => {
    const unique = new Map();
    exams.forEach((exam) => {
      const key = normalizeSearchText(exam.name);
      if (!unique.has(key)) unique.set(key, exam);
    });
    return Array.from(unique.values());
  }, []);

  const filteredSchedulingExams = useMemo(() => {
    const query = normalizeSearchText(examSearch);
    if (!query) return availableExams;

    return availableExams.filter((exam) =>
      normalizeSearchText(exam.name).includes(query) ||
      normalizeSearchText(exam.category).includes(query) ||
      exam.synonyms.some((term) => normalizeSearchText(term).includes(query))
    );
  }, [availableExams, examSearch]);

  const filteredSchedulingCheckups = useMemo(() => {
    const query = normalizeSearchText(checkupSearch);
    if (!query) return examBatteries;

    return examBatteries.filter((checkup) =>
      normalizeSearchText(checkup.name).includes(query) ||
      normalizeSearchText(checkup.description).includes(query)
    );
  }, [checkupSearch]);

  useEffect(() => {
    setForm((current) => ({ ...current, exams: selectedExams }));
  }, [selectedExams]);

  useEffect(() => {
    if (window.sessionStorage.getItem("exatta-scroll-to-form") !== "1") return;

    window.sessionStorage.removeItem("exatta-scroll-to-form");

    const timer = window.setTimeout(() => {
      document.getElementById("formulario-agendamento")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (examPickerRef.current && !examPickerRef.current.contains(event.target)) {
        setExamPickerOpen(false);
      }
      if (checkupPickerRef.current && !checkupPickerRef.current.contains(event.target)) {
        setCheckupPickerOpen(false);
      }
      if (servicePickerRef.current && !servicePickerRef.current.contains(event.target)) {
        setServicePickerOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setExamPickerOpen(false);
        setCheckupPickerOpen(false);
        setServicePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleExam = (examName) => {
    onToggleExam(examName);
  };

  const removeExam = (examName) => {
    if (selectedExams.includes(examName)) {
      onToggleExam(examName);
    }
  };

  const toggleCheckup = (checkupName) => {
    setForm((current) => ({
      ...current,
      checkups: current.checkups.includes(checkupName)
        ? current.checkups.filter((name) => name !== checkupName)
        : [...current.checkups, checkupName]
    }));
  };

  const removeCheckup = (checkupName) => {
    setForm((current) => ({
      ...current,
      checkups: current.checkups.filter((name) => name !== checkupName)
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "cpf" ? formatCPF(value) : value
    }));
  };

  const examsList = form.exams.length
    ? form.exams.map((examName) => `- ${examName}`).join("\n")
    : "Não informado";

  const checkupsList = form.checkups.length
    ? form.checkups.map((checkupName) => `- ${checkupName}`).join("\n")
    : "Não informado";

  const message = [
    "Olá, gostaria de solicitar um agendamento na EXATTA.",
    `Nome: ${form.name || "Não informado"}`,
    `Telefone: ${form.phone || "Não informado"}`,
    `CPF: ${form.cpf || "Não informado"}`,
    `Serviço de interesse: ${form.service || "Não informado"}`,
    `Exames:\n${examsList}`,
    `Checkups/Combos de interesse:\n${checkupsList}`,
    `Data de preferência: ${form.date ? formatDateBR(form.date) : "Não informada"}`,
    `Observações: ${form.message || "Nenhuma"}`
  ].join("\n");

  return (
    <>
      <LabBackdrop />
      <PageHero
        tag="AGENDAMENTO"
        title="Agende seu atendimento com a EXATTA."
        text="Escolha uma data de preferência, informe o exame e envie sua solicitação. Nossa equipe confirma os detalhes com você."
        image="/images/page-home-agendamento.webp"
        badge="AGENDAMENTO • ATENDIMENTO HUMANIZADO"
      />

      <section className="section">
        <div className="container scheduling-grid">
          <div className="scheduling-info">
            <div className="section-tag">COMO FUNCIONA</div>
            <h2>Uma solicitação simples e direta.</h2>

            <div className="schedule-reassurance">
              <div><ShieldCheck size={20}/><div><strong>Solicitação segura</strong><span>Seus dados são usados para montar a mensagem de atendimento.</span></div></div>
              <div><Clock3 size={20}/><div><strong>Confirmação pela equipe</strong><span>O horário só fica confirmado após o retorno da EXATTA.</span></div></div>
            </div>

            <div className="step-list">
              <div className="step-item">
                <span>01</span>
                <div>
                  <strong>Preencha seus dados</strong>
                  <p>Informe nome, telefone e o exame de interesse.</p>
                </div>
              </div>

              <div className="step-item">
                <span>02</span>
                <div>
                  <strong>Envie a solicitação</strong>
                  <p>O formulário monta uma mensagem para o WhatsApp.</p>
                </div>
              </div>

              <div className="step-item">
                <span>03</span>
                <div>
                  <strong>Confirme com a equipe</strong>
                  <p>A EXATTA verifica horários e orientações necessárias.</p>
                </div>
              </div>
            </div>
          </div>

          <form
            id="formulario-agendamento"
            className="schedule-form"
            onSubmit={(event) => {
              event.preventDefault();
              window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
              onClearExams();
            }}
          >
            <label>
              Nome completo
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Digite seu nome"
                required
              />
            </label>

            <label>
              Telefone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </label>

            <label>
              CPF
              <input
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
              />
            </label>

            <div className="schedule-exam-field" ref={servicePickerRef}>
              <span className="schedule-exam-field-label">Serviço de interesse</span>
              <button
                type="button"
                className={`schedule-exam-trigger ${form.service ? "has-value" : ""}`}
                onClick={() => setServicePickerOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={servicePickerOpen}
              >
                <span>{form.service || "Selecione um serviço"}</span>
                <ChevronDown size={17} />
              </button>

              {servicePickerOpen && (
                <div className="schedule-service-popover" role="listbox" aria-label="Selecionar serviço">
                  {["Coleta no Laboratório", "Coleta Domiciliar", "Atendimento Infantil"].map((service) => (
                    <button
                      key={service}
                      type="button"
                      className={`schedule-service-option ${form.service === service ? "selected" : ""}`}
                      onClick={() => {
                        setForm((current) => ({ ...current, service }));
                        setServicePickerOpen(false);
                      }}
                      role="option"
                      aria-selected={form.service === service}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="schedule-exam-field" ref={examPickerRef}>
              <span className="schedule-exam-field-label">Exames de interesse</span>
              <button
                type="button"
                className={`schedule-exam-trigger ${form.exams.length ? "has-value" : ""}`}
                onClick={() => setExamPickerOpen((open) => !open)}
                aria-haspopup="dialog"
                aria-expanded={examPickerOpen}
              >
                <span>
                  {form.exams.length
                    ? `${form.exams.length} exame${form.exams.length > 1 ? "s" : ""} selecionado${form.exams.length > 1 ? "s" : ""}`
                    : "Selecione um ou mais exames"}
                </span>
                <ChevronDown size={17} />
              </button>

              {form.exams.length > 0 && (
                <div className="schedule-selected-exams" aria-label="Exames selecionados">
                  {form.exams.map((examName) => (
                    <span className="schedule-selected-exam" key={examName}>
                      <span>{examName}</span>
                      <button
                        type="button"
                        onClick={() => removeExam(examName)}
                        aria-label={`Remover ${examName}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {examPickerOpen && (
                <div className="schedule-exam-popover" role="dialog" aria-label="Selecionar exame">
                  <div className="schedule-exam-popover-head">
                    <div>
                      <strong>Escolha os exames</strong>
                      <span>{availableExams.length} exames disponíveis • {form.exams.length} selecionado{form.exams.length === 1 ? "" : "s"}</span>
                    </div>
                    <button
                      type="button"
                      className="schedule-exam-close"
                      onClick={() => setExamPickerOpen(false)}
                      aria-label="Fechar lista de exames"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="schedule-exam-search">
                    <Search size={17} />
                    <input
                      value={examSearch}
                      onChange={(event) => setExamSearch(event.target.value)}
                      placeholder="Pesquisar exame..."
                      autoFocus
                      aria-label="Pesquisar exame"
                    />
                  </div>

                  <div className="schedule-exam-results">
                    {filteredSchedulingExams.length > 0 ? (
                      filteredSchedulingExams.map((exam) => (
                        <button
                          type="button"
                          className={`schedule-exam-option ${form.exams.includes(exam.name) ? "selected" : ""}`}
                          key={`${exam.category}-${exam.name}`}
                          onClick={() => toggleExam(exam.name)}
                        >
                          <span>
                            <strong>{exam.name}</strong>
                            <small>{exam.category}</small>
                          </span>
                          {form.exams.includes(exam.name) && <CheckCircle2 size={18} />}
                        </button>
                      ))
                    ) : (
                      <div className="schedule-exam-empty">
                        <Search size={19} />
                        <strong>Exame não encontrado</strong>
                        <span>Tente pesquisar por outro nome.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="schedule-exam-field" ref={checkupPickerRef}>
              <span className="schedule-exam-field-label">Checkups/Combos de interesse <small>(opcional)</small></span>
              <button
                type="button"
                className={`schedule-exam-trigger ${form.checkups.length ? "has-value" : ""}`}
                onClick={() => setCheckupPickerOpen((open) => !open)}
                aria-haspopup="dialog"
                aria-expanded={checkupPickerOpen}
              >
                <span>
                  {form.checkups.length
                    ? `${form.checkups.length} combo${form.checkups.length > 1 ? "s" : ""} selecionado${form.checkups.length > 1 ? "s" : ""}`
                    : "Selecione um ou mais checkups/combos"}
                </span>
                <ChevronDown size={17} />
              </button>

              {form.checkups.length > 0 && (
                <div className="schedule-selected-exams" aria-label="Checkups e combos selecionados">
                  {form.checkups.map((checkupName) => (
                    <span className="schedule-selected-exam" key={checkupName}>
                      <span>{checkupName}</span>
                      <button
                        type="button"
                        onClick={() => removeCheckup(checkupName)}
                        aria-label={`Remover ${checkupName}`}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {checkupPickerOpen && (
                <div className="schedule-exam-popover" role="dialog" aria-label="Selecionar checkups e combos">
                  <div className="schedule-exam-popover-head">
                    <div>
                      <strong>Escolha os checkups/combos</strong>
                      <span>{examBatteries.length} opções disponíveis • {form.checkups.length} selecionado{form.checkups.length === 1 ? "" : "s"}</span>
                    </div>
                    <button
                      type="button"
                      className="schedule-exam-close"
                      onClick={() => setCheckupPickerOpen(false)}
                      aria-label="Fechar lista de checkups e combos"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="schedule-exam-search">
                    <Search size={17} />
                    <input
                      value={checkupSearch}
                      onChange={(event) => setCheckupSearch(event.target.value)}
                      placeholder="Pesquisar checkup ou combo..."
                      autoFocus
                      aria-label="Pesquisar checkup ou combo"
                    />
                  </div>

                  <div className="schedule-exam-results">
                    {filteredSchedulingCheckups.length > 0 ? (
                      filteredSchedulingCheckups.map((checkup) => (
                        <button
                          type="button"
                          className={`schedule-exam-option ${form.checkups.includes(checkup.name) ? "selected" : ""}`}
                          key={checkup.name}
                          onClick={() => toggleCheckup(checkup.name)}
                        >
                          <span>
                            <strong>{checkup.name}</strong>
                            <small>{checkup.exams.length} exames no combo</small>
                          </span>
                          {form.checkups.includes(checkup.name) && <CheckCircle2 size={18} />}
                        </button>
                      ))
                    ) : (
                      <div className="schedule-exam-empty">
                        <Search size={19} />
                        <strong>Checkup ou combo não encontrado</strong>
                        <span>Tente pesquisar por outro nome.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="schedule-exam-field">
              <span className="schedule-exam-field-label">Data de preferência</span>
              <DatePicker
                value={form.date}
                onChange={(newDate) => setForm((current) => ({ ...current, date: newDate }))}
              />
            </div>

            <label>
              Observações
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Escreva alguma informação que deseja enviar à equipe."
                rows="4"
                maxLength={100}
              />
              <span className="schedule-character-count">{form.message.length}/100 caracteres</span>
            </label>

            <button className="button primary full" type="submit">
              Enviar solicitação pelo WhatsApp
              <ArrowRight size={17} />
            </button>

            <small className="form-note">
              O envio abre o WhatsApp. O horário só é considerado confirmado
              após a resposta da equipe da EXATTA.
            </small>
          </form>
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <LabBackdrop />
      <PageHero
        tag="CONTATO"
        title="Fale com a EXATTA."
        text="Encontre rapidamente o canal que você precisa para tirar dúvidas, consultar exames ou solicitar um agendamento."
        image="/images/page-home-contato.webp"
        badge="ATENDIMENTO • ESTAMOS AQUI PARA VOCÊ"
      />

      <section className="section contact contact-page">
        <div className="container">
          <div className="contact-page-intro">
            <div>
              <div className="section-tag">CANAIS DE ATENDIMENTO</div>
              <h2>Entre em contato com a nossa equipe.</h2>
            </div>

            <p>
              Escolha o canal mais conveniente. Para atendimento mais rápido,
              fale conosco pelo WhatsApp.
            </p>
          </div>

          <div className="contact-page-layout">
            <div className="contact-details-grid">
              <a className="contact-detail-card" href={`tel:${clinic.phone}`}>
                <span className="contact-detail-icon">
                  <Phone size={22} />
                </span>
                <div className="contact-detail-content">
                  <small>Telefone</small>
                  <strong>{clinic.phone}</strong>
                  <span>Toque para ligar</span>
                </div>
                <ArrowRight className="contact-detail-arrow" size={18} />
              </a>

              <a
                className="contact-detail-card"
                href={whatsappLink(
                  "Olá, gostaria de falar com a EXATTA pelo WhatsApp."
                )}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-detail-icon">
                  <FaWhatsapp size={22} />
                </span>
                <div className="contact-detail-content">
                  <small>WhatsApp</small>
                  <strong>{clinic.whatsappDisplay}</strong>
                  <span>Fale diretamente com a equipe</span>
                </div>
                <ArrowRight className="contact-detail-arrow" size={18} />
              </a>

              <a className="contact-detail-card" href={`mailto:${clinic.email}`}>
                <span className="contact-detail-icon">
                  <Mail size={22} />
                </span>
                <div className="contact-detail-content">
                  <small>E-mail</small>
                  <strong>{clinic.email}</strong>
                  <span>Envie sua mensagem</span>
                </div>
                <ArrowRight className="contact-detail-arrow" size={18} />
              </a>

              <a
                className="contact-detail-card"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  clinic.address
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-detail-icon">
                  <MapPin size={22} />
                </span>
                <div className="contact-detail-content">
                  <small>Endereço</small>
                  <strong>{clinic.address}</strong>
                  <span>Abrir localização no mapa</span>
                </div>
                <ArrowRight className="contact-detail-arrow" size={18} />
              </a>
            </div>

            <div className="contact-panel contact-panel-new">
              <div className="panel-icon">
                <MessageCircle size={25} />
              </div>

              <div className="contact-panel-tag">ATENDIMENTO</div>

              <h3>Precisa falar com a EXATTA?</h3>

              <p>
                Nossa equipe pode orientar você sobre exames, preparo,
                agendamento e outras informações do laboratório.
              </p>

              <a
                className="contact-action whatsapp-action"
                href={whatsappLink(
                  "Olá, gostaria de falar com a EXATTA."
                )}
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp size={20} />
                <span>
                  <strong>Falar pelo WhatsApp</strong>
                  <small>{clinic.whatsappDisplay}</small>
                </span>
                <ArrowRight size={18} />
              </a>

              <a className="contact-action" href={`tel:${clinic.phone}`}>
                <Phone size={19} />
                <span>
                  <strong>Ligar para a EXATTA</strong>
                  <small>{clinic.phone}</small>
                </span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section contact-visual-section">
        <div className="container contact-visual-card">
          <div className="contact-visual-copy">
            <div className="section-tag">ATENDIMENTO EXATTA</div>
            <h2>Quando você precisar, nossa equipe está a um contato de distância.</h2>
            <p className="lead">Escolha o canal mais confortável para você. Para dúvidas e agendamentos, o WhatsApp é o caminho mais rápido.</p>
          </div>
          <div className="contact-visual-image">
            <img src="/images/page-home-atendimento-exatta.webp" alt="Profissional de saúde atendendo paciente" />
            <div><MessageCircle size={18}/><span>Atendimento humanizado</span></div>
          </div>
        </div>
      </section>

      <section className="contact-location">
        <div className="container contact-location-card">
          <div className="contact-location-info">
            <div className="contact-location-icon">
              <MapPin size={24} />
            </div>

            <div className="contact-location-copy">
              <div className="section-tag">ONDE ESTAMOS</div>
              <h2>Visite a EXATTA</h2>
              <p>{clinic.address}</p>
            </div>

            <div className="contact-location-actions">
              <a
                className="button secondary"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  clinic.address
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Abrir no Google Maps
                <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div className="contact-location-map">
            <iframe
              title="Localização da EXATTA no Google Maps"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                clinic.address
              )}&t=m&z=16&hl=pt-BR&iwloc=B&output=embed`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>
    </>
  );
}


const faqItems = [
  {
    question: "Preciso estar em jejum para fazer exames?",
    answer: "Depende do exame solicitado. Alguns exames não exigem jejum, enquanto outros podem exigir um período específico. Antes da coleta, confirme a orientação correspondente ao exame com a equipe da EXATTA."
  },
  {
    question: "Posso beber água durante o jejum?",
    answer: "Em muitos exames, a ingestão de água em quantidade habitual é permitida e pode até facilitar a coleta. Porém, as orientações podem variar conforme o exame, então siga sempre a instrução recebida pela equipe."
  },
  {
    question: "Remédios podem interferir nos resultados dos exames?",
    answer: "Alguns medicamentos podem alterar determinados resultados. Não interrompa nenhum medicamento por conta própria. Informe à equipe quais medicamentos utiliza para que ela possa orientar você corretamente."
  },
  {
    question: "Posso tomar café antes da coleta?",
    answer: "Quando o exame exige jejum, café, mesmo sem açúcar, pode não ser recomendado. Para evitar interferências, siga a orientação específica do exame e confirme com a equipe da EXATTA."
  },
  {
    question: "Posso fumar antes de fazer exames?",
    answer: "O cigarro pode interferir em alguns parâmetros laboratoriais. Quando houver orientação de jejum ou preparo, o ideal é evitar fumar até a realização da coleta, salvo orientação diferente da equipe."
  },
  {
    question: "A menstruação interfere nos exames?",
    answer: "Pode interferir principalmente em exames relacionados à urina e em alguns exames ginecológicos. Informe à equipe se estiver menstruada para receber a orientação adequada para o exame solicitado."
  },
  {
    question: "Bebida alcoólica pode alterar os resultados?",
    answer: "Sim. O consumo de álcool pode interferir em alguns exames laboratoriais. Quando houver preparo específico, siga o período de restrição informado pela equipe antes da coleta."
  },
  {
    question: "O esforço físico pode alterar o resultado dos exames?",
    answer: "Sim. Exercícios intensos podem alterar temporariamente alguns marcadores laboratoriais. Se o exame exigir preparo, siga a orientação recebida e informe à equipe sobre atividades físicas intensas realizadas antes da coleta."
  },
  {
    question: "Por que é importante desprezar o primeiro jato da urina?",
    answer: "Em exames de urina em que essa orientação é indicada, o primeiro jato pode carregar células e secreções presentes na uretra. Desprezá-lo ajuda a obter uma amostra mais representativa da urina que está na bexiga."
  },
  {
    question: "Posso fazer exames quando estou com gripe ou febre?",
    answer: "Depende do exame e do motivo da coleta. Alguns resultados podem ser influenciados por infecções ou febre. Informe à equipe como você está se sentindo para que ela possa orientar se é melhor realizar ou remarcar a coleta."
  }
];

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-page art-faq">
      <section className="faq-hero">
        <div className="container faq-layout">
          <div className="faq-intro">
            <div className="section-tag">Perguntas frequentes</div>
            <h1>As principais dúvidas antes dos seus exames.</h1>
            <p>
              Reunimos orientações gerais para ajudar você a se preparar.
              Como o preparo pode variar conforme o exame, confirme sempre
              as instruções específicas com a equipe da EXATTA.
            </p>
          </div>

          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div className={isOpen ? "faq-item is-open" : "faq-item"} key={item.question}>
                  <button
                    className="faq-question"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={18} />
                  </button>

                  <div className="faq-answer-wrap">
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function LgpdPage() {
  return (
    <>
      <LabBackdrop />
      <PageHero
        tag="PRIVACIDADE"
        title="Privacidade e LGPD."
        text="Informação, transparência e cuidado também fazem parte da experiência digital da EXATTA."
        image="/images/lgpd-privacidade-exatta.webp"
        badge="PRIVACIDADE • SEGURANÇA DE DADOS"
      />

      <section className="section">
        <div className="container legal-page">
          <div>
            <div className="section-tag">INFORMAÇÕES</div>
            <h2>Proteção e transparência</h2>
          </div>

          <div className="legal-content">
            <h3>Tratamento de dados</h3>
            <p>
              A <b>EXATTA Análises Clínicas</b> valoriza a privacidade e a proteção dos dados pessoais de seus pacientes, colaboradores e visitantes. O tratamento das informações é realizado de forma responsável, transparente e de acordo com a legislação aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais <b>(LGPD — Lei nº 13.709/2018)</b>. <br />

Os dados pessoais fornecidos por meio do site, canais de atendimento ou durante o atendimento na clínica poderão ser utilizados para finalidades relacionadas à prestação dos serviços, como agendamento de exames, identificação do paciente, comunicação sobre atendimentos, orientações relacionadas aos exames e disponibilização de resultados. <br /> <br />

Quando necessário para a realização dos serviços laboratoriais, poderão ser tratados dados pessoais e informações relacionadas à saúde, considerados dados pessoais sensíveis pela LGPD. Essas informações são utilizadas exclusivamente para as finalidades legítimas relacionadas ao atendimento e à execução dos serviços oferecidos pela EXATTA. <br />
A EXATTA busca adotar medidas técnicas e administrativas adequadas para proteger os dados pessoais contra acessos não autorizados, perda, alteração, divulgação ou qualquer forma de tratamento inadequado. <br /> 

Os dados poderão ser mantidos pelo período necessário para cumprir as finalidades para as quais foram coletados, atender obrigações legais ou regulatórias e resguardar direitos da EXATTA, dos pacientes e de terceiros. <br /> <br />

O titular dos dados poderá solicitar informações sobre o tratamento de seus dados e exercer os direitos previstos na legislação aplicável, observadas as limitações e condições estabelecidas pela LGPD. <br /> 

Para dúvidas, solicitações ou informações relacionadas à privacidade e ao tratamento de dados pessoais, entre em contato com a EXATTA Análises Clínicas pelo canal oficial
            </p>

            <h3>Contato</h3>
            <p>
              Para informações relacionadas à privacidade, utilize o canal
              de contato oficial da EXATTA:<br></br>
              <a
            href="mailto:exattalab@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
           <b>exattalab@gmail.com</b>
          </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section page-soft privacy-principles">
        <div className="container">
          <div className="section-heading centered">
            <div className="section-tag">PRINCÍPIOS</div>
            <h2>Privacidade também faz parte do cuidado.</h2>
            <p>Uma comunicação responsável sobre dados pessoais ajuda a construir uma relação mais transparente com o paciente.</p>
          </div>
          <div className="info-cards-grid">
            <article className="info-card"><ShieldCheck size={26}/><h3>Transparência</h3><p>Apresentamos de forma clara como os dados pessoais são coletados, utilizados e tratados pela EXATTA.</p></article>
            <article className="info-card"><FileText size={26}/><h3>Informação</h3><p>Disponibilizamos informações sobre o tratamento de dados para que nossos pacientes possam compreender como suas informações são utilizadas.</p></article>
            <article className="info-card"><HeartPulse size={26}/><h3>Responsabilidade</h3><p>Tratamos os dados pessoais com cuidado, respeito e segurança, buscando preservar a privacidade e a confiança de nossos pacientes.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}

function ExamCart({ selectedExams, onToggleExam, onToggleBattery, onClearExams, navigate }) {
  const [open, setOpen] = useState(false);

  if (!selectedExams.length) return null;

  const batteryNames = examBatteries.map((battery) => battery.name);
  const selectedBatteries = examBatteries.filter((battery) =>
    selectedExams.includes(battery.name)
  );
  const bundledExamNames = new Set(
    selectedBatteries.flatMap((battery) => battery.exams)
  );
  const looseExams = selectedExams.filter(
    (item) => !batteryNames.includes(item) && !bundledExamNames.has(item)
  );

  return (
    <div className={`exam-cart ${open ? "open" : ""}`}>
      {open ? (
        <div className="exam-cart-panel">
          <div className="exam-cart-head">
            <div>
              <span className="exam-cart-kicker">SUA SELEÇÃO</span>
              <h3>Exames escolhidos</h3>
              <p>{selectedExams.length} exame{selectedExams.length > 1 ? "s" : ""} selecionado{selectedExams.length > 1 ? "s" : ""}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar carrinho">
              <X size={18} />
            </button>
          </div>

          <div className="exam-cart-items">
            {selectedBatteries.length > 0 ? (
              <div className="exam-cart-group">
                <span className="exam-cart-group-label">Checkup selecionado</span>

                {selectedBatteries.map((battery) => (
                  <div className="exam-cart-item exam-cart-item-battery" key={battery.name}>
                    <div>
                      <strong>{battery.name}</strong>
                      <span>{battery.exams.length} exames incluídos</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleBattery(battery)}
                      aria-label={`Remover ${battery.name}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {looseExams.length > 0 ? (
              <div className="exam-cart-group">
                <span className="exam-cart-group-label">Exames soltos selecionados</span>

                {looseExams.map((examName) => {
                  const exam = exams.find((item) => item.name === examName);
                  return (
                    <div className="exam-cart-item" key={examName}>
                      <div>
                        <strong>{examName}</strong>
                        {exam ? <span>{exam.category}</span> : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleExam(examName)}
                        aria-label={`Remover ${examName}`}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="exam-cart-actions">
            <button
              className="exam-cart-clear"
              type="button"
              onClick={() => {
                onClearExams();
                setOpen(false);
              }}
            >
              Limpar seleção
            </button>
            <button
              className="button primary full"
              type="button"
              onClick={() => {
                setOpen(false);
                window.sessionStorage.setItem("exatta-scroll-to-form", "1");
                navigate("/agendamento");
              }}
            >
              Continuar para agendamento
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      ) : null}

      <button
        className="exam-cart-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Abrir seleção de exames"
      >
        <span className="exam-cart-trigger-icon">
          <ShoppingCart size={21} />
          <strong>{selectedExams.length}</strong>
        </span>
        <span>
          <small>SELEÇÃO DE EXAMES</small>
          <b>Ver exames escolhidos</b>
        </span>
        <ArrowRight size={18} className="exam-cart-trigger-arrow" />
      </button>
    </div>
  );
}

function NotFoundPage({ navigate }) {
  return (
    <section className="section not-found-page">
      <div className="container">
        <div className="section-tag">PÁGINA NÃO ENCONTRADA</div>
        <h1>Essa página não existe.</h1>
        <p>
          O endereço informado não corresponde a uma página da EXATTA.
        </p>

        <button
          className="button primary"
          onClick={() => navigate("/")}
        >
          Voltar ao início
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}

function App() {
  const { path, navigate } = useRoute();
  const [selectedExams, setSelectedExams] = useState(() => {
    try {
      const saved = window.localStorage.getItem("exatta-selected-exams");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem("exatta-selected-exams", JSON.stringify(selectedExams));
  }, [selectedExams]);

  const toggleExam = (examName) => {
    setSelectedExams((current) =>
      current.includes(examName)
        ? current.filter((name) => name !== examName)
        : [...current, examName]
    );
  };

  const clearExams = () => setSelectedExams([]);

  const toggleBattery = (battery) => {
    setSelectedExams((current) => {
      const alreadySelected = current.includes(battery.name);

      if (alreadySelected) {
        return current.filter(
          (item) => item !== battery.name && !battery.exams.includes(item)
        );
      }

      const newItems = [battery.name, ...battery.exams].filter(
        (item) => !current.includes(item)
      );

      return [...current, ...newItems];
    });
  };

  useEffect(() => {
    document.title = `${routeTitles[path] || "EXATTA"} — Análises Clínicas`;
  }, [path]);

  useScrollReveal(path);

  const renderPage = () => {
    switch (path) {
      case "/":
        return <Home navigate={navigate} selectedExams={selectedExams} onToggleExam={toggleExam} />;

      case "/sobre":
        return <AboutPage navigate={navigate} />;

      case "/exames":
        return <ExamsPage navigate={navigate} selectedExams={selectedExams} onToggleExam={toggleExam} onToggleBattery={toggleBattery} />;

      case "/servicos":
        return <ServicesPage navigate={navigate} />;

      case "/perguntas-frequentes":
        return <FaqPage />;

      case "/agendamento":
        return <SchedulingPage selectedExams={selectedExams} onToggleExam={toggleExam} onClearExams={clearExams} />;

      case "/contato":
        return <ContactPage />;

      case "/lgpd":
        return <LgpdPage />;

      default:
        return <NotFoundPage navigate={navigate} />;
    }
  };

  return (
    <div className="app">
      <Header navigate={navigate} path={path} />

      <main>{renderPage()}</main>

      <Footer navigate={navigate} />

      {path !== "/agendamento" ? (
        <ExamCart
          selectedExams={selectedExams}
          onToggleExam={toggleExam}
          onToggleBattery={toggleBattery}
          onClearExams={clearExams}
          navigate={navigate}
        />
      ) : null}

      <a
        className="floating-whatsapp"
        href={whatsappLink(
          "Olá, gostaria de falar com a EXATTA."
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a EXATTA pelo WhatsApp"
      >
        <FaWhatsapp size={22} />
      </a>
    </div>
  );
}

export default App;
