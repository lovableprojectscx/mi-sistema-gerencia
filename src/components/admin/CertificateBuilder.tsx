
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Move, Type, Calendar, Image as ImageIcon, Save, Download, Eye, Plus, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface FieldPosition {
    id: string;
    label: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    visible: boolean;
    value?: string; // For preview
}

const defaultFields: FieldPosition[] = [
    { id: "studentName", label: "Nombre del Estudiante", x: 50, y: 40, fontSize: 32, color: "#000000", fontFamily: "Helvetica", visible: true, value: "Maria Elena Torres" },
    { id: "studentDni", label: "DNI del Estudiante", x: 50, y: 48, fontSize: 14, color: "#333333", fontFamily: "Helvetica", visible: true, value: "DNI: 12345678" },
    { id: "courseName", label: "Nombre del Curso", x: 50, y: 55, fontSize: 24, color: "#333333", fontFamily: "Helvetica", visible: true, value: "Diplomado en Cuidados Intensivos" },
    { id: "date", label: "Fecha de Emisión", x: 50, y: 70, fontSize: 16, color: "#666666", fontFamily: "Helvetica", visible: true, value: "15 de Enero, 2026" },
    { id: "code", label: "Número de Registro", x: 80, y: 90, fontSize: 12, color: "#999999", fontFamily: "Courier New", visible: true, value: "REG-2026-001" },
];

interface CertificateBuilderProps {
    courseId?: string;
    defaultMetadata?: { key: string, value: string }[];
    template?: any;
    onTemplateChange?: (template: any) => void;
}

export function CertificateBuilder({ courseId, defaultMetadata = [], template, onTemplateChange }: CertificateBuilderProps) {
    const [bgImageFront, setBgImageFront] = useState<string>(template?.bgImageFront || template?.bgImage || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&auto=format&fit=crop&q=80");
    const [bgImageBack, setBgImageBack] = useState<string>(template?.bgImageBack || ""); // Default empty/white
    const [activePage, setActivePage] = useState<"front" | "back">("front");

    const [uploading, setUploading] = useState(false);

    // Ensure fields have 'page' property. detailed migration.
    const initialFields = (template?.fields && template.fields.length > 0)
        ? template.fields.map((f: any) => ({ ...f, page: f.page || "front" }))
        : defaultFields.map(f => ({ ...f, page: "front" }));

    // Add default back fields if not present
    if (!initialFields.some((f: any) => f.page === "back")) {
        initialFields.push(
            { id: "code-back", label: "Número de Registro", x: 50, y: 30, fontSize: 32, color: "#000000", fontFamily: "Courier New", visible: true, value: "REG-2026-001", page: "back" },
            { id: "studentName-back", label: "Nombre del Estudiante", x: 50, y: 50, fontSize: 24, color: "#333333", fontFamily: "Helvetica", visible: true, value: "Maria Elena Torres", page: "back" }
        );
    }

    const [fields, setFields] = useState<any[]>(initialFields);
    const [fetchedMetadata, setFetchedMetadata] = useState<{ key: string, value: string }[]>(defaultMetadata);

    useEffect(() => {
        if (defaultMetadata) setFetchedMetadata(defaultMetadata);
    }, [defaultMetadata]);

    useEffect(() => {
        if (template) {
            if (template.bgImageFront && template.bgImageFront !== bgImageFront) setBgImageFront(template.bgImageFront);
            if (template.bgImageBack && template.bgImageBack !== bgImageBack) setBgImageBack(template.bgImageBack);
            // Re-sync fields if needed, simplified for now
        }
    }, [template]);

    const notifyParent = (currentFields: any[], bgF: string, bgB: string) => {
        if (onTemplateChange) {
            onTemplateChange({
                bgImageFront: bgF,
                bgImageBack: bgB,
                bgImage: bgF, // Legacy support
                fields: currentFields
            });
        }
    };

    const fieldsRef = useRef(fields);
    useEffect(() => { fieldsRef.current = fields; }, [fields]);

    // Metadata injection
    // Metadata injection - Only if we don't have a template or explicitly resetting
    // Removed automatic injection on every metadata change to prevent "zombie" fields that user deleted
    const [hoursType, setHoursType] = useState<"academic" | "lecture" | "both">("academic");

    // Initial load of fields logic is already handled by initialFields const
    // We just need to handle dynamic updates from metadata or hoursType

    useEffect(() => {
        // Only run this if we have metadata to process
        if (fetchedMetadata.length === 0) return;

        setFields(prevFields => {
            // 1. Identify current metadata fields in the canvas to avoid duplicates
            const existingFieldLabels = new Set(prevFields.map(f => f.label));

            // 2. Filter metadata based on Hours Type selection
            const relevantMetadata = fetchedMetadata.filter(meta => {
                if (hoursType === "academic" && meta.key === "Horas Lectivas") return false;
                if (hoursType === "lecture" && meta.key === "Horas Académicas") return false;
                return true;
            });

            // 3. Create new fields for relevant metadata that ISN'T already there
            // BUT: We must be careful not to re-add deleted fields if this is an "update" (Zombie bug).
            // Solution: Only auto-add if this seems to be an initial population (e.g. template empty)
            // OR if the user explicitly switched the type, we should force the switch.

            // Let's handle the "Switch" logic specifically for Hours:
            // If we are in "academic", remove "Horas Lectivas" if present.
            // If we are in "lecture", remove "Horas Académicas" if present.

            let newFieldsList = [...prevFields];

            // Remove excluded types
            if (hoursType === "academic") {
                newFieldsList = newFieldsList.filter(f => f.label !== "Horas Lectivas");
            } else if (hoursType === "lecture") {
                newFieldsList = newFieldsList.filter(f => f.label !== "Horas Académicas");
            }

            // Add missing types (Only if they are meant to be there)
            // We only auto-add if the template was empty originally OR if we are forcing a switch?
            // To be safe and user-friendly: Check if the *concept* is missing.

            relevantMetadata.forEach((meta, i) => {
                // If it's already there (by label), skip
                if (newFieldsList.some(f => f.label === meta.key)) return;

                // If it's one of the "Hours" fields, we SHOULD add it if it's missing (user switched mode)
                // If it's a random other metadata, don't auto-add if user maybe deleted it? 
                // Let's prioritize the Hours fields specifically since that's the feature request.
                const isHoursField = meta.key === "Horas Académicas" || meta.key === "Horas Lectivas";

                // Only add if it's an Hours field (to support the toggle) OR if we are in a "fresh" state
                const isFreshState = (!template?.fields || template.fields.length === 0);

                if (isHoursField || isFreshState) {
                    newFieldsList.push({
                        id: `meta-${meta.key.replace(/\s+/g, '-')}`, // Stable ID based on key
                        label: meta.key,
                        x: 20,
                        y: 85 + (i * 5),
                        fontSize: 14,
                        color: "#333333",
                        fontFamily: "Helvetica",
                        visible: true,
                        value: meta.value,
                        page: "front"
                    });
                }
            });

            return newFieldsList;
        });
    }, [fetchedMetadata, hoursType, template]);

    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSave = async () => {
        if (!courseId) return;
        const templateData = { bgImageFront, bgImageBack, bgImage: bgImageFront, fields };

        const { error } = await supabase
            .from("courses")
            .update({ certificate_template: templateData })
            .eq("id", courseId);

        if (error) toast.error("Error al guardar: " + error.message);
        else {
            toast.success("Diseño guardado correctamente");
            if (onTemplateChange) onTemplateChange(templateData);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Subiendo imagen...");

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `cert-${activePage}-${Math.random()}.${fileExt}`;
            const filePath = `certificates/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('course-content').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('course-content').getPublicUrl(filePath);

            if (activePage === "front") {
                setBgImageFront(data.publicUrl);
                notifyParent(fields, data.publicUrl, bgImageBack);
            } else {
                setBgImageBack(data.publicUrl);
                notifyParent(fields, bgImageFront, data.publicUrl);
            }
            toast.success("Fondo actualizado", { id: toastId });
        } catch (error: any) {
            console.error(error);
            toast.error("Error: " + error.message, { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const updateField = (id: string, updates: any) => {
        const newFields = fields.map(f => f.id === id ? { ...f, ...updates } : f);
        setFields(newFields);
        notifyParent(newFields, bgImageFront, bgImageBack);
    };

    const addCustomField = () => {
        const newId = `custom-${Date.now()}`;
        setFields([
            ...fields,
            { id: newId, label: "Nuevo Campo", x: 50, y: 50, fontSize: 18, color: "#000000", fontFamily: "Helvetica", visible: true, value: "Texto", page: activePage }
        ]);
        setSelectedFieldId(newId);
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
        if (selectedFieldId === id) setSelectedFieldId(null);
    };

    const selectedField = fields.find(f => f.id === selectedFieldId);

    // Drag Logic
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ id: string; startX: number; startY: number; initialLeft: number; initialTop: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        if (!containerRef.current) return;
        e.preventDefault(); e.stopPropagation();
        const field = fields.find(f => f.id === id);
        if (!field) return;

        setIsDragging(true); setSelectedFieldId(id);
        dragRef.current = { id, startX: e.clientX, startY: e.clientY, initialLeft: field.x, initialTop: field.y };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!dragRef.current || !containerRef.current) return;
        const { startX, startY, initialLeft, initialTop, id } = dragRef.current;
        const rect = containerRef.current.getBoundingClientRect();
        const deltaX = ((e.clientX - startX) / rect.width) * 100;
        const deltaY = ((e.clientY - startY) / rect.height) * 100;

        const newX = Math.max(0, Math.min(100, initialLeft + deltaX));
        const newY = Math.max(0, Math.min(100, initialTop + deltaY));

        setFields(prev => prev.map(f => f.id === id ? { ...f, x: Number(newX.toFixed(1)), y: Number(newY.toFixed(1)) } : f));
    };

    const handleGlobalMouseUp = () => {
        if (dragRef.current) notifyParent(fieldsRef.current, bgImageFront, bgImageBack);
        setIsDragging(false); dragRef.current = null;
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    const handlePreviewPDF = async () => {
        // Simple preview alert for now as dual page preview is complex in one canvas without proper render
        toast.info("Para ver el PDF completo, guarda y usa la vista previa del estudiante.");
    };

    const activeFields = fields.filter(f => f.visible && f.page === activePage);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 h-[calc(100vh-100px)]">

            <div className="flex flex-col gap-4">
                <Tabs value={activePage} onValueChange={(v: any) => setActivePage(v)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="front">Hoja 1 (Frontal)</TabsTrigger>
                        <TabsTrigger value="back">Hoja 2 (Reverso)</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="bg-muted/30 rounded-xl border border-border p-4 flex items-center justify-center overflow-hidden relative shadow-sm flex-1">
                    <div
                        ref={containerRef}
                        className="relative max-w-full max-h-full aspect-[1.414/1] w-auto h-auto bg-white shadow-2xl rounded-sm overflow-hidden select-none"
                        style={{ width: 'auto', height: 'auto' }}
                    >
                        {/* Background */}
                        {(activePage === "front" ? bgImageFront : bgImageBack) ? (
                            <img src={activePage === "front" ? bgImageFront : bgImageBack} alt="Certificate Template" className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100">
                                Sube una plantilla para la {activePage === "front" ? "Hoja 1" : "Hoja 2"}
                            </div>
                        )}

                        {/* Fields */}
                        {activeFields.map((field) => (
                            <div
                                key={field.id}
                                onMouseDown={(e) => handleMouseDown(e, field.id)}
                                onClick={(e) => { e.stopPropagation(); setSelectedFieldId(field.id); }}
                                style={{
                                    position: "absolute",
                                    left: `${field.x}%`,
                                    top: `${field.y}%`,
                                    transform: "translate(-50%, -50%)",
                                    fontSize: `${field.fontSize}px`,
                                    color: field.color,
                                    fontFamily: field.fontFamily,
                                    cursor: isDragging ? "grabbing" : "grab",
                                    border: selectedFieldId === field.id ? "2px dashed blue" : "1px dashed transparent",
                                    padding: "4px 8px",
                                    zIndex: selectedFieldId === field.id ? 20 : 10,
                                    whiteSpace: "nowrap"
                                }}
                                className="hover:border-primary/50 transition-colors font-bold"
                            >
                                {field.value}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pr-2">
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <Label className="text-base font-semibold">Fondo del Certificado ({activePage === "front" ? "Frontal" : "Reverso"})</Label>
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <Input
                                    type="file"
                                    id="cert-bg-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                <Button variant="outline" className="w-full" asChild disabled={uploading}>
                                    <Label htmlFor="cert-bg-upload" className="cursor-pointer flex items-center justify-center">
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                        {uploading ? "Subiendo..." : "Subir Imagen"}
                                    </Label>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 overflow-y-auto">
                    <CardContent className="p-4 space-y-6">
                        <div className="space-y-2 pb-4 border-b">
                            <Label className="text-base font-semibold">Configuración de Horas</Label>
                            <Select value={hoursType} onValueChange={(v: any) => setHoursType(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione tipo de horas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="academic">Solo Horas Académicas</SelectItem>
                                    <SelectItem value="lecture">Solo Horas Lectivas</SelectItem>
                                    <SelectItem value="both">Ambas (Si existen)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Define qué tipo de carga horaria mostrar en el certificado.</p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Campos - {activePage === 'front' ? 'Frontal' : 'Reverso'}</Label>
                            <Button variant="outline" className="w-full border-dashed" onClick={addCustomField}>
                                <Plus className="w-4 h-4 mr-2" /> Agregar Campo
                            </Button>

                            <div className="grid gap-2 mt-2">
                                {activeFields.map(field => (
                                    <div key={field.id} className="flex gap-2">
                                        <Button
                                            variant={selectedFieldId === field.id ? "default" : "outline"}
                                            className="justify-start text-xs flex-1 truncate"
                                            onClick={() => setSelectedFieldId(field.id)}
                                        >
                                            {field.label}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive" onClick={() => removeField(field.id)}>
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedField && (
                            <div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-right-4">
                                <h4 className="font-medium text-sm text-primary">Editando: {selectedField.label}</h4>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Texto / Etiqueta</Label>
                                        <Input value={selectedField.label} onChange={(e) => updateField(selectedField.id, { label: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Tamaño</Label>
                                            <Input type="number" value={selectedField.fontSize} onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Color</Label>
                                            <Input type="color" value={selectedField.color} className="h-9" onChange={(e) => updateField(selectedField.id, { color: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Fuente</Label>
                                        <Select value={selectedField.fontFamily} onValueChange={(val) => updateField(selectedField.id, { fontFamily: val })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                                <SelectItem value="Courier New">Courier New</SelectItem>
                                                <SelectItem value="Arial">Arial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                    <Button onClick={handleSave} disabled={!courseId}>
                        <Save className="w-4 h-4 mr-2" /> Guardar Todo
                    </Button>
                </div>
            </div>
        </div>
    );
}
