
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Smartphone,
    Copy,
    ScanLine,
    Loader2,
    UploadCloud,
    CreditCard,
    Lock,
    FileText,
    AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";
import { motion } from "framer-motion";

export default function Checkout() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const { settings } = useSiteSettings();
    const [user, setUser] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                toast.error("Debes iniciar sesión para comprar");
                navigate("/login");
            } else {
                setUser(data.user);
            }
        });
    }, [navigate]);

    // Fetch real course
    const { data: course, isLoading: loadingCourse } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => courseService.getById(courseId!),
        enabled: !!courseId
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // 1. Check if already enrolled
            const { data: existing } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .single();

            if (existing) {
                toast.info("Ya tienes una solicitud para este curso");
                navigate("/dashboard");
                return;
            }

            // 1.5 Upload Voucher if exists
            let voucherUrl = null;
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `receipts/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('course-content')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('course-content')
                    .getPublicUrl(filePath);

                voucherUrl = publicUrl;
            }

            // 2. Create Enrollment (Pending)
            const { data: newEnrollment, error } = await supabase
                .from('enrollments')
                .insert([{
                    user_id: user.id,
                    course_id: courseId,
                    status: 'pending',
                    progress: 0,
                    voucher_url: voucherUrl
                }])
                .select('id')
                .single();

            if (error) throw error;

            toast.success("Inscripción solicitada. Verificaremos tu pago pronto.");
            navigate(`/checkout/success?enrollmentId=${newEnrollment.id}`);
        } catch (error: any) {
            toast.error("Error al procesar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loadingCourse) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
    }

    if (!course) return <div className="min-h-screen flex items-center justify-center">Curso no encontrado</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 container-custom pt-32 pb-20">
                {/* Steps Indicator */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm font-medium">1</span>
                            <span>Resumen</span>
                        </div>
                        <div className="w-12 h-[1px] bg-border" />
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm shadow-lg shadow-primary/25">2</span>
                            <span>Pago</span>
                        </div>
                        <div className="w-12 h-[1px] bg-border" />
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-sm font-medium">3</span>
                            <span>Confirmación</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">

                    {/* Left Column: Payment Methods */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">Finalizar Compra</h1>
                            <p className="text-muted-foreground">Selecciona tu método de pago y completa tu inscripción.</p>
                        </div>

                        <Card className="border-border shadow-sm overflow-hidden">
                            <CardHeader className="bg-secondary/20 border-b border-border/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Smartphone className="w-5 h-5 text-primary" />
                                    Pago vía Yape / Plin
                                </CardTitle>
                                <CardDescription>La forma más rápida de inscribirte. Escanea y listo.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 space-y-8">
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
                                    {/* QR Card */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-border w-48 shrink-0 relative group">
                                        {settings?.payment_qr_url ? (
                                            <div className="aspect-square relative overflow-hidden rounded-lg">
                                                <img
                                                    src={settings.payment_qr_url}
                                                    alt="QR de Pago"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ScanLine className="w-8 h-8 text-white drop-shadow-md" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 rounded-lg text-muted-foreground">
                                                <ScanLine className="w-8 h-8 mb-2 opacity-50" />
                                                <span className="text-xs">Sin QR</span>
                                            </div>
                                        )}
                                        <p className="text-center text-xs font-medium text-muted-foreground mt-3">Escanea desde tu App</p>
                                    </div>

                                    {/* Number & Info */}
                                    <div className="flex-1 space-y-6 w-full text-center md:text-left">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Número de Celular</Label>
                                                <div className="flex items-center gap-3 mt-1.5 container-input bg-secondary/30 p-1 pl-4 rounded-lg border border-border">
                                                    <span className="font-mono text-xl font-bold tracking-wide text-foreground flex-1 text-left">
                                                        {settings?.payment_number || "9-- --- ---"}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        className="bg-white text-foreground hover:bg-gray-50 border border-border shadow-sm"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(settings?.payment_number || "");
                                                            toast.success("Número copiado al portapapeles");
                                                        }}
                                                    >
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        Copiar
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Titular de la cuenta</Label>
                                                <div className="flex items-center gap-2 mt-1 text-foreground font-medium">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                    {settings?.site_name || "Gerencia y Desarrollo Global"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 border border-amber-100 text-amber-700 p-3 rounded-lg text-sm flex gap-3 text-left">
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                            <p>Importante: Realiza el pago por el monto exacto y guarda la captura de pantalla de la confirmación.</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Upload Section - Improved */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="voucher" className="text-base font-semibold">Adjuntar Comprobante</Label>
                                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">Requerido</span>
                                    </div>

                                    <div
                                        className={`
                                            border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative
                                            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/30"}
                                            ${file ? "bg-green-50 border-green-200" : ""}
                                        `}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <Input
                                            id="voucher"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />

                                        {file ? (
                                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                </div>
                                                <p className="font-semibold text-green-700 text-lg">{file.name}</p>
                                                <p className="text-green-600/80 text-sm mt-1">Archivo listo para subir</p>
                                                <Button size="sm" variant="outline" className="mt-4 border-green-200 text-green-700 hover:bg-green-100 z-20 relative">
                                                    Cambiar archivo
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-muted-foreground pointer-events-none">
                                                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                                                    <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <p className="font-medium text-foreground">Arrastra tu comprobante aquí</p>
                                                <p className="text-sm mt-1">o haz clic para explorar archivos</p>
                                                <p className="text-xs mt-4 text-muted-foreground/70">Soporta JPG, PNG o PDF (Max 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground grayscale opacity-70">
                            <div className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL Seguro</div>
                            <span>•</span>
                            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Garantía de Satisfacción</div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <Card className="border-border shadow-lg overflow-hidden">
                                <CardHeader className="bg-slate-900 text-white p-6">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-accent" />
                                        Resumen de Orden
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {/* Course Item */}
                                    <div className="flex gap-4">
                                        <img
                                            src={course.image_url || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=100&h=100&fit=crop"}
                                            alt={course.title}
                                            className="w-20 h-20 object-cover rounded-md border border-border shadow-sm shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm line-clamp-2 leading-tight mb-1">{course.title}</h4>
                                            <span className="text-xs text-muted-foreground block mb-2">{course.instructor?.name || "Gerencia Global"}</span>
                                            {course.original_price && course.original_price > course.price && (
                                                <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50 px-1.5 py-0 h-5">
                                                    Ahorras S/{course.original_price - course.price}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Totals */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Precio Regular</span>
                                            <span className="line-through">S/ {course.original_price || course.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>Descuento</span>
                                            <span>- S/ {course.original_price ? (course.original_price - course.price) : 0}</span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between items-end">
                                            <span className="font-semibold">Total a pagar</span>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-primary leading-none">S/ {course.price}</div>
                                                <div className="text-xs text-muted-foreground mt-1">Incluido IGV</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                                        onClick={handleSubmit}
                                        disabled={loading || !file}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Completar Inscripción <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    {!file && (
                                        <p className="text-xs text-center text-red-500 font-medium animate-pulse">
                                            * Debes adjuntar el comprobante para continuar
                                        </p>
                                    )}

                                </CardContent>
                                <CardFooter className="bg-secondary/30 p-4 border-t border-border">
                                    <div className="flex items-center justify-center w-full gap-2 text-xs text-muted-foreground">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span>Garantía de devolución de dinero si no estás satisfecho</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
