import { motion } from "framer-motion";
import { Award, ShieldCheck, Clock, Laptop, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Award,
    title: "Certificables Verificables",
    description: "Código QR único en cada certificado para validación instantánea en LinkedIn y ante empleadores.",
  },
  {
    icon: ShieldCheck,
    title: "Respaldo Institucional",
    description: "Programas avalados por colegios profesionales y entidades de prestigio a nivel nacional.",
  },
  {
    icon: Clock,
    title: "A tu Propio Ritmo",
    description: "Acceso ilimitado 24/7. Avanza según tu agenda sin perder la calidad del aprendizaje.",
  },
  {
    icon: Laptop,
    title: "100% Online y Flexible",
    description: "Campus virtual de última generación optimizado para aprender desde cualquier dispositivo.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="section-padding bg-[#0f172a] relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              <span>Calidad Educativa Garantizada</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Invertir en tu futuro <br />
              <span className="font-display italic text-accent">
                siempre vale la pena
              </span>
            </h2>

            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
              Más de 10,000 egresados ya han impulsado su trayectoria profesional con nuestra metodología. Únete a una red de excelencia y destaca en el mercado laboral.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="hero" size="xl" className="shadow-lg shadow-accent/20">
                <Link to="/catalogo">
                  Comenzar ahora
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="text-white border-white/20 hover:bg-white/5">
                <a href="#testimonials">
                  Ver casos de éxito
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right Features Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative p-6 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 overflow-hidden"
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-accent/30 transition-all duration-300 shadow-lg">
                      <IconComponent className="w-7 h-7 text-accent group-hover:text-emerald-300 transition-colors" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
