
import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, Share2, Printer, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";


import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function CertificateViewer() {
    const { id } = useParams();
    const certificateRef = useRef<HTMLDivElement>(null);
    const backPageRef = useRef<HTMLDivElement>(null); // Added backPageRef

    const { data: certificate, isLoading, error } = useQuery({
        queryKey: ["certificate", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("certificates")
                .select(`
                    *,
                    enrollment:enrollments(
                        student:profiles(full_name, dni),
                        course:courses(title, certificate_template, metadata)
                    )
                `)
                .eq("id", id)
                .maybeSingle();

            if (error) throw error;
            return data; // Returns null if not found, handled by component
        },
        enabled: !!id
    });

    const handleDownloadPDF = async () => {
        if (!certificateRef.current || !backPageRef.current) return; // Updated check

        const toastId = toast.loading("Generando PDF..."); // Added toast

        try {
            // Capture Front
            const canvasFront = await html2canvas(certificateRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: null,
            });

            // Capture Back
            const canvasBack = await html2canvas(backPageRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: "#ffffff", // White background for back
            });

            const imgDataFront = canvasFront.toDataURL("image/png");
            const imgDataBack = canvasBack.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: canvasFront.width > canvasFront.height ? "landscape" : "portrait",
                unit: "px",
                format: [canvasFront.width, canvasFront.height],
            });

            // Add Front Page
            pdf.addImage(imgDataFront, "PNG", 0, 0, canvasFront.width, canvasFront.height);

            // Add Back Page
            pdf.addPage([canvasBack.width, canvasBack.height], canvasBack.width > canvasBack.height ? "landscape" : "portrait");
            pdf.addImage(imgDataBack, "PNG", 0, 0, canvasBack.width, canvasBack.height);

            pdf.save(`certificado-${id}.pdf`);
            toast.dismiss(toastId); // Added toast
            toast.success("PDF descargado correctamente"); // Added toast
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.dismiss(toastId); // Added toast
            toast.error("Error al generar PDF"); // Added toast
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;

    if (error || !certificate) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <h1 className="text-xl font-bold">Certificado no encontrado</h1>
            <p className="text-muted-foreground">El código de verificación no es válido o el certificado no existe.</p>
            <Link to="/"><Button variant="outline">Volver al inicio</Button></Link>
        </div>
    );

    const { enrollment, issued_at } = certificate;
    const { student, course } = enrollment || {};
    const template = course?.certificate_template || {};

    // Default values if no template
    const bgImageFront = template.bgImageFront || template.bgImage || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&auto=format&fit=crop&q=80";
    const bgImageBack = template.bgImageBack || null;

    const getFieldValue = (field: any) => {
        switch (field.id) {
            case "studentName":
            case "studentName-back":
                return certificate.metadata?.student_name || student?.full_name || "Estudiante";
            case "studentDni":
            case "studentDni-back":
                const dni = certificate.metadata?.student_dni || student?.dni;
                return dni ? `DNI: ${dni}` : "DNI: --------";
            case "courseName":
            case "courseName-back":
                return course?.title || "Curso";
            case "date":
            case "date-back":
                return issued_at ? format(new Date(issued_at), "d 'de' MMMM, yyyy", { locale: es }) : "Fecha desconocida";
            case "code":
            case "code-back":
                return certificate.code || certificate.id;
            default:
                if (field.id.startsWith('meta-')) {
                    const metaKey = field.label;
                    return certificate.metadata?.[metaKey] || course.metadata?.find((m: any) => m.key === metaKey)?.value || "";
                }
                if (field.id.startsWith('custom-')) {
                    return field.value;
                }
                return "";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 py-8 mt-20">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header Actions */}
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" asChild>
                            <Link to="/dashboard">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al Panel
                            </Link>
                        </Button>
                        <div className="flex gap-2">
                            {/* Share button removed per context implicitly favoring simplicity */}
                            <Button onClick={handleDownloadPDF} className="shadow-lg hover:shadow-xl transition-all">
                                <Download className="w-4 h-4 mr-2" />
                                Descargar PDF
                            </Button>
                        </div>
                    </div>

                    {/* Certificate Preview Card (Front) */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden p-8 flex flex-col items-center gap-8">
                        <div>
                            <h2 className="text-center text-lg font-semibold text-muted-foreground mb-4">Vista Frontal (Hoja 1)</h2>
                            <div
                                ref={certificateRef}
                                className="relative bg-white shadow-2xl mx-auto overflow-hidden select-none"
                                style={{
                                    width: '800px',
                                    height: '566px', // ~A4 landscape aspect ratio approx
                                }}
                            >
                                {/* Background Image */}
                                <img
                                    src={bgImageFront}
                                    alt="Certificate Background Front"
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                />

                                {/* Fields Front */}
                                {template.fields?.map((field: any) => (
                                    (field.visible && (!field.page || field.page === 'front')) && (
                                        <div
                                            key={field.id}
                                            style={{
                                                position: "absolute",
                                                left: `${field.x}%`,
                                                top: `${field.y}%`,
                                                transform: "translate(-50%, -50%)",
                                                fontSize: `${field.fontSize}px`,
                                                color: field.color,
                                                fontFamily: field.fontFamily,
                                                textAlign: "center",
                                                whiteSpace: "nowrap",
                                                maxWidth: "90%", // Limit width to prevent varying overflows
                                                fontWeight: "bold",
                                                lineHeight: 1.2
                                            }}
                                            className="print:leading-none"
                                        >
                                            {getFieldValue(field)}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Certificate Back Page (Hoja 2) */}
                        <div>
                            <h2 className="text-center text-lg font-semibold text-muted-foreground mb-4">Vista Posterior (Hoja 2)</h2>
                            <div
                                ref={backPageRef}
                                className="relative bg-white shadow-2xl mx-auto overflow-hidden select-none flex flex-col items-center justify-center border"
                                style={{
                                    width: '800px',
                                    height: '566px',
                                }}
                            >
                                {/* Background Image Back (Optional) */}
                                {bgImageBack && (
                                    <img
                                        src={bgImageBack}
                                        alt="Certificate Background Back"
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    />
                                )}

                                {/* Default Back Content if no fields for page='back' defined */}
                                {!template.fields?.some((f: any) => f.page === 'back') && !bgImageBack ? (
                                    <div className="text-center space-y-8 p-12 w-full h-full flex flex-col justify-center border-4 border-double border-gray-200 m-4 rounded-xl">
                                        <div className="space-y-2">
                                            <p className="text-sm uppercase tracking-widest text-muted-foreground">Número de Registro</p>
                                            <h2 className="text-3xl font-mono font-bold text-foreground">
                                                {certificate.code || certificate.id}
                                            </h2>
                                        </div>

                                        <div className="w-24 h-1 bg-gray-200 mx-auto rounded-full" />

                                        <div className="space-y-2">
                                            <p className="text-sm uppercase tracking-widest text-muted-foreground">Otorgado a</p>
                                            <h3 className="text-2xl font-serif font-bold text-foreground">
                                                {certificate.metadata?.student_name || student?.full_name}
                                            </h3>
                                        </div>

                                        <div className="absolute bottom-8 left-0 right-0 text-center">
                                            <p className="text-xs text-gray-400">Gerencia y Desarrollo Global</p>
                                        </div>
                                    </div>
                                ) : (
                                    /* Fields Back */
                                    template.fields?.map((field: any) => (
                                        (field.visible && field.page === 'back') && (
                                            <div
                                                key={field.id}
                                                style={{
                                                    position: "absolute",
                                                    left: `${field.x}%`,
                                                    top: `${field.y}%`,
                                                    transform: "translate(-50%, -50%)",
                                                    fontSize: `${field.fontSize}px`,
                                                    color: field.color,
                                                    fontFamily: field.fontFamily,
                                                    textAlign: "center",
                                                    whiteSpace: "nowrap",
                                                    maxWidth: "90%",
                                                    fontWeight: "bold",
                                                    lineHeight: 1.2
                                                }}
                                                className="print:leading-none"
                                            >
                                                {getFieldValue(field)}
                                            </div>
                                        )
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
}
