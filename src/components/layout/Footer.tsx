import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TermsContent = () => (
  <div className="prose dark:prose-invert max-w-none p-4">
    <p className="text-sm text-muted-foreground mb-4">Última actualización: Enero 2026</p>
    <h3 className="text-lg font-semibold mb-2">1. Aceptación de los Términos</h3>
    <p className="mb-4 text-muted-foreground">Al acceder y utilizar la plataforma de Gerencia y Desarrollo Global, aceptas cumplir con los siguientes términos y condiciones de uso.</p>
    <h3 className="text-lg font-semibold mb-2">2. Propiedad Intelectual</h3>
    <p className="mb-4 text-muted-foreground">Todo el contenido mostrado en esta plataforma (videos, textos, materiales PDF, logotipos) es propiedad exclusiva de Gerencia y Desarrollo Global o de sus instructores, y está protegido por las leyes de derechos de autor. Está prohibida su reproducción o distribución sin autorización.</p>
    <h3 className="text-lg font-semibold mb-2">3. Inscripciones y Pagos</h3>
    <p className="mb-4 text-muted-foreground">Las inscripciones se consideran confirmadas una vez verificado el pago. Nos reservamos el derecho de cancelar inscripciones fraudulentas o que no cumplan con los requisitos del programa.</p>
    <h3 className="text-lg font-semibold mb-2">4. Certificación</h3>
    <p className="mb-4 text-muted-foreground">La emisión de certificados está sujeta a la aprobación de las evaluaciones correspondientes y a la asistencia mínima requerida en cada curso. Los certificados digitales se envían al correo registrado.</p>
    <h3 className="text-lg font-semibold mb-2">5. Política de Reembolso</h3>
    <p className="mb-4 text-muted-foreground">Se aceptan solicitudes de reembolso hasta 7 días antes del inicio del curso. Una vez iniciado el programa, no se realizan devoluciones, salvo casos excepcionales debidamente justificados.</p>
  </div>
);

const PrivacyContent = () => (
  <div className="prose dark:prose-invert max-w-none p-4">
    <p className="text-sm text-muted-foreground mb-4">Última actualización: Enero 2026</p>
    <h3 className="text-lg font-semibold mb-2">1. Recopilación de Información</h3>
    <p className="mb-4 text-muted-foreground">En Gerencia y Desarrollo Global, recopilamos información personal necesaria para brindarte nuestros servicios educativos, como tu nombre, correo electrónico, número de teléfono y datos de facturación.</p>
    <h3 className="text-lg font-semibold mb-2">2. Uso de la Información</h3>
    <p className="mb-4 text-muted-foreground">Utilizamos tu información para procesar inscripciones, emitir certificaciones, enviar actualizaciones sobre tus cursos y mejorar nuestra plataforma.</p>
    <h3 className="text-lg font-semibold mb-2">3. Protección de Datos</h3>
    <p className="mb-4 text-muted-foreground">Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra el acceso no autorizado. No compartimos tu información personal con terceros sin tu consentimiento, salvo por obligación legal.</p>
    <h3 className="text-lg font-semibold mb-2">4. Tus Derechos</h3>
    <p className="mb-4 text-muted-foreground">Tienes derecho a acceder, corregir o eliminar tu información personal de nuestros registros. Para ejercer estos derechos, contáctanos a través de nuestros canales oficiales.</p>
  </div>
);

const RefundContent = () => (
  <div className="prose dark:prose-invert max-w-none p-4">
    <p className="text-sm text-muted-foreground mb-4">Transparencia y Garantía para nuestros estudiantes.</p>
    <h3 className="text-lg font-semibold mb-2">1. Plazo de Solicitud</h3>
    <p className="mb-4 text-muted-foreground">Puedes solicitar el reembolso total de tu inscripción hasta 7 días calendario antes de la fecha de inicio del programa o curso.</p>
    <h3 className="text-lg font-semibold mb-2">2. Reembolsos Parciales</h3>
    <p className="mb-4 text-muted-foreground">Si solicitas la anulación de tu matrícula dentro de los 7 días previos al inicio o durante la primera semana de clases por motivos justificados, se aplicará una retención del 20% por gastos administrativos.</p>
    <h3 className="text-lg font-semibold mb-2">3. Casos No Reembolsables</h3>
    <p className="mb-4 text-muted-foreground">No se realizarán devoluciones una vez transcurrida la primera semana de clases o si el estudiante ha accedido y consumido más del 10% del contenido digital, para proteger la propiedad intelectual del material.</p>
    <h3 className="text-lg font-semibold mb-2">4. Proceso de Devolución</h3>
    <p className="mb-4 text-muted-foreground">Los reembolsos aprobados se procesarán en un plazo de 15 a 30 días hábiles, a través del mismo medio de pago utilizado originalmente.</p>
  </div>
);

const FAQContent = () => (
  <div className="p-4">
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="item-1" className="border border-border rounded-lg px-4">
        <AccordionTrigger className="text-left font-medium text-foreground">¿Los certificados son válidos para concursos públicos?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Sí, nuestros certificados son emitidos con el respaldo de instituciones universitarias y colegios profesionales, cumpliendo con los requisitos de horas académicas y créditos necesarios para concursos públicos y escalafones.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2" className="border border-border rounded-lg px-4">
        <AccordionTrigger className="text-left font-medium text-foreground">¿Cómo accedo a las clases?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Una vez inscrito, tendrás acceso inmediato a nuestra Aula Virtual. Podrás ver las clases en vivo según el cronograma o acceder a las grabaciones en cualquier momento (24/7) desde tu computadora o celular.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className="border border-border rounded-lg px-4">
        <AccordionTrigger className="text-left font-medium text-foreground">¿Cuáles son las formas de pago?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Aceptamos transferencias bancarias (BCP, Interbank, BBVA, Banco de la Nación), Yape, Plin y pagos con tarjeta de crédito/débito a través de nuestra pasarela segura.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4" className="border border-border rounded-lg px-4">
        <AccordionTrigger className="text-left font-medium text-foreground">¿Cuánto tiempo tengo acceso al curso?</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Tendrás acceso al contenido del curso (videos, materiales, foros) por un periodo de 12 meses después de finalizado el programa, para que puedas repasar cuando lo necesites.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

const footerLinks = {
  escuelas: [
    { label: "Escuela de Salud", href: "/catalogo?area=health", type: "link" },
    { label: "Escuela de Ingeniería", href: "/catalogo?area=engineering", type: "link" },
    { label: "Escuela de Agronomía", href: "/catalogo?area=agronomy", type: "link" },
    { label: "Gestión Pública y Empresarial", href: "/catalogo?area=management", type: "link" },
  ],
  recursos: [
    { label: "Preguntas Frecuentes", type: "modal", content: <FAQContent />, title: "Preguntas Frecuentes" },
    { label: "Verificar Certificado", href: "/verificar", type: "link" },
  ],
  legal: [
    { label: "Términos y Condiciones", type: "modal", content: <TermsContent />, title: "Términos y Condiciones" },
    { label: "Política de Privacidad", type: "modal", content: <PrivacyContent />, title: "Política de Privacidad" },
    { label: "Política de Reembolso", type: "modal", content: <RefundContent />, title: "Política de Reembolso" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/GyDGlobal", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@GYDGlobal", label: "Youtube" },
];

export const Footer = () => {
  const { settings } = useSiteSettings();

  const renderLink = (link: any) => {
    if (link.type === 'modal') {
      return (
        <Dialog>
          <DialogTrigger className="text-white/70 hover:text-accent transition-colors text-left hover:underline">
            {link.label}
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden bg-background">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl font-bold text-foreground">{link.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-full max-h-[calc(85vh-80px)] w-full">
              {link.content}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <Link
        to={link.href}
        className="text-white/70 hover:text-accent transition-colors"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-contain scale-125" />
                </div>
                <div>
                  <div className="font-bold text-lg">{settings?.site_name || "Gerencia y Desarrollo Global"}</div>
                  <div className="text-sm text-white/70">{settings?.site_description || "Educación de Calidad"}</div>
                </div>
              </div>
            </Link>
            <p className="text-white/70 mb-6 max-w-sm leading-relaxed">
              Formando profesionales de excelencia desde 2015. Educación de calidad
              con certificaciones válidas para tu crecimiento profesional.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href={`mailto:${settings?.contact_email || "info@gerenciaglobal.edu.pe"}`} className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                {settings?.contact_email || "info@gerenciaglobal.edu.pe"}
              </a>
              <a href={`tel:${settings?.payment_number || "+51972787508"}`} className="flex items-center gap-3 text-white/70 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                {settings?.payment_number || "+51 972 787 508"}
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-4 h-4" />
                Lima, Perú
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Escuelas */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Escuelas</h4>
            <ul className="space-y-3">
              {footerLinks.escuelas.map((link) => (
                <li key={link.label}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.label}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} {settings?.site_name || "Gerencia y Desarrollo Global"}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-white/60">
            Hecho con 💚 en Perú
          </p>
        </div>
      </div>
    </footer >
  );
};
