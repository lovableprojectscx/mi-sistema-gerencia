import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  CheckCircle,
  Users,
  Award,
  BookOpen,
  Globe,
  Handshake,
  GraduationCap,
  Building2,
  Heart,
  Lightbulb,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import aboutTeam from "@/assets/nosotros-team-new.png";
import { useEffect, useRef, useState } from "react";
import logo3d from "@/assets/logo-3d-nosotros.png";

const objectives = [
  {
    icon: Target,
    text: "Fortalecer las competencias técnicas y profesionales de nuestros participantes",
  },
  {
    icon: BookOpen,
    text: "Brindar programas de capacitación alineados a las necesidades del mercado laboral",
  },
  {
    icon: Lightbulb,
    text: "Promover la actualización permanente de conocimientos",
  },
  {
    icon: Building2,
    text: "Contribuir al desarrollo institucional de organizaciones públicas y privadas",
  },
  {
    icon: Handshake,
    text: "Impulsar alianzas y convenios estratégicos con instituciones académicas y entidades",
  },
];

const services = [
  { icon: Globe, title: "Cursos de capacitación virtuales" },
  { icon: Users, title: "Cursos de capacitación presenciales" },
  { icon: Award, title: "Cursos de especialización" },
  { icon: GraduationCap, title: "Talleres prácticos" },
];


const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const springValue = useSpring(0, { duration: 2000 });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = displayValue.on("change", (v) => setCurrentValue(v));
    return () => unsubscribe();
  }, [displayValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {currentValue.toLocaleString()}{suffix}
    </span>
  );
};

const Nosotros = () => {
  const stats = [
    { value: 5000, label: "Estudiantes certificados", suffix: "+" },
    { value: 120, label: "Cursos disponibles", suffix: "+" },
    { value: 50, label: "Docentes expertos", suffix: "+" },
    { value: 98, label: "Satisfacción", suffix: "%" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-hero-gradient overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="container-custom relative z-10 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Institución Líder en Capacitación
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
                Transformamos el presente para{" "}
                <span className="text-accent font-display italic">
                  liderar el futuro
                </span>
              </h1>

              <p className="text-lg text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                Centro de Capacitación de Educación Continua orientado a fortalecer
                las competencias profesionales, técnicas y humanas.
              </p>
            </motion.div>

            {/* Logo Image with 3D Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
              className="lg:w-1/2 relative"
            >
              <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
                {/* Decorative background glow */}
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-[80px] animate-pulse" />

                {/* Checkered/Grid background for frame effect */}
                <div className="absolute inset-10 border-2 border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-0 border border-white/5 rounded-full rotate-45" />

                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 bg-white/5 backdrop-blur-sm p-8 rounded-[3rem] border border-white/10 shadow-2xl ring-1 ring-white/20"
                >
                  <img
                    src={logo3d}
                    alt="Logo Gerencia y Desarrollo Global"
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Naturaleza Institucional */}
      <section className="section-padding bg-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 text-accent text-sm font-semibold mb-6 tracking-wide uppercase">
                <Building2 className="w-4 h-4" />
                Naturaleza Institucional
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                Formación de excelencia para un{" "}
                <span className="text-accent font-display italic">mundo global</span>
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Somos un Centro de Capacitación de Educación Continua dedicado a la
                  formación y actualización permanente de competencias profesionales.
                </p>
                <p>
                  Brindamos cursos de capacitación, cursos de especialización y talleres,
                  desarrollados en modalidad virtual y presencial, con certificación,
                  orientados al fortalecimiento de capacidades, la mejora de la empleabilidad
                  y el desempeño laboral.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Certificación</h4>
                    <p className="text-sm text-muted-foreground">Válida a nivel nacional</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Expertos</h4>
                    <p className="text-sm text-muted-foreground">Docentes calificados</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="absolute -inset-4 bg-accent/10 rounded-[2rem] -rotate-3" />
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl">
                <img
                  src={aboutTeam}
                  alt="Equipo de trabajo Gerencia"
                  className="w-full h-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Misión y Visión - Glassmorphism */}
      <section className="section-padding bg-slate-900 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />

        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Misión */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Target className="w-32 h-32 text-white" />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-8 shadow-lg shadow-accent/10">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Misión</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Contribuir al desarrollo profesional y humano de nuestros participantes
                  mediante programas de capacitación accesibles, actualizados y de calidad,
                  promoviendo el aprendizaje continuo, la innovación y la mejora del desempeño
                  laboral en los sectores público y privado.
                </p>
              </div>
            </motion.div>

            {/* Visión */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <Eye className="w-32 h-32 text-white" />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Visión</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Ser un centro de capacitación líder a nivel nacional e internacional,
                  reconocido por la calidad académica de sus programas, la excelencia
                  de sus docentes, la modalidad flexible de enseñanza virtual y presencial,
                  y su impacto positivo en el desarrollo profesional y social.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Objetivos Institucionales */}
      <section className="section-padding bg-secondary/20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Objetivos <span className="text-accent font-display italic">Institucionales</span>
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((objective, index) => {
              const IconComponent = objective.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card hover:bg-card/50 p-8 rounded-2xl border border-border/50 hover:border-accent/40 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/5 mt-2 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-accent group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-foreground/80 leading-relaxed text-lg font-medium">{objective.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 z-0" />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold text-accent mb-4 tracking-tighter">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/70 text-lg font-medium tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compromiso */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center mx-auto mb-8 shadow-lg shadow-accent/25">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
              Compromiso <span className="font-display italic text-accent">Institucional</span>
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-10 font-light">
              "Gerencia y Desarrollo Global asume el compromiso de mantener altos estándares
              de calidad académica, ética institucional y mejora continua."
            </p>
            <Link to="/catalogo" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white shadow-xl shadow-accent/20 font-bold text-lg hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
              Atrévete a soñar con ser el mejor
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Nosotros;
