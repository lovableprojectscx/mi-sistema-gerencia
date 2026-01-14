
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 mt-20 max-w-4xl">
                <h1 className="text-4xl font-bold text-center mb-8">Preguntas Frecuentes</h1>
                <p className="text-center text-muted-foreground mb-12 text-lg">
                    Resolvemos tus dudas principales sobre nuestros cursos y certificaciones.
                </p>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="text-lg font-medium">¿Los certificados son válidos para concursos públicos?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Sí, nuestros certificados son emitidos con el respaldo de instituciones universitarias y colegios profesionales, cumpliendo con los requisitos de horas académicas y créditos necesarios para concursos públicos y escalafones.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="text-lg font-medium">¿Cómo accedo a las clases?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Una vez inscrito, tendrás acceso inmediato a nuestra Aula Virtual. Podrás ver las clases en vivo según el cronograma o acceder a las grabaciones en cualquier momento (24/7) desde tu computadora o celular.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="text-lg font-medium">¿Cuáles son las formas de pago?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Aceptamos transferencias bancarias (BCP, Interbank, BBVA, Banco de la Nación), Yape, Plin y pagos con tarjeta de crédito/débito a través de nuestra pasarela segura.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border border-border rounded-lg px-4">
                        <AccordionTrigger className="text-lg font-medium">¿Cuánto tiempo tengo acceso al curso?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                            Tendrás acceso al contenido del curso (videos, materiales, foros) por un periodo de 12 meses después de finalizado el programa, para que puedas repasar cuando lo necesites.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </main>
            <Footer />
        </div>
    );
}
