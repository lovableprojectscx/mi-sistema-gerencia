
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, UserCheck, Shield, Loader2, Trash2, Key, Divide } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminUsers() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    // Mutations
    const toggleRoleMutation = useMutation({
        mutationFn: async ({ id, currentRole }: { id: string, currentRole: string }) => {
            const newRole = currentRole === 'admin' ? 'student' : 'admin';
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', id);
            if (error) throw error;
            return newRole;
        },
        onSuccess: (newRole) => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success(`Rol actualizado a ${newRole === 'admin' ? 'Administrador' : 'Estudiante'}`);
        },
        onError: (e: any) => toast.error("Error al actualizar rol: " + e.message),
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.rpc('delete_user_by_admin', { target_user_id: id });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("Usuario eliminado correctamente");
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        },
        onError: (e: any) => toast.error("Error al eliminar usuario: " + e.message),
    });

    const filteredUsers = users?.filter((user: any) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dni?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o DNI..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : !filteredUsers?.length ? (
                    <div className="p-12 text-center text-muted-foreground">No hay usuarios encontrados.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha Registro</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.full_name || "Sin Nombre"}</span>
                                            <span className="text-xs text-muted-foreground">DNI: {user.dni || "-"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === "admin" ? (
                                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Admin
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Estudiante</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">
                                            Activo
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.created_at ? format(new Date(user.created_at), "dd MMM yyyy", { locale: es }) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsDialogOpen(true);
                                                }}>
                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                    Ver Perfil
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => toggleRoleMutation.mutate({ id: user.id, currentRole: user.role })}>
                                                    <Key className="mr-2 h-4 w-4" />
                                                    {user.role === 'admin' ? 'Hacer Estudiante' : 'Hacer Admin'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {
                                                    setUserToDelete(user.id);
                                                    setIsDeleteDialogOpen(true);
                                                }}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar Usuario
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Perfil de Usuario</DialogTitle>
                        <DialogDescription>
                            Detalles registrados del usuario en el sistema.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={selectedUser.avatar_url} />
                                    <AvatarFallback className="text-2xl">{selectedUser.full_name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Nombre</Label>
                                <div className="col-span-3 font-medium">{selectedUser.full_name || "Sin registro"}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">DNI</Label>
                                <div className="col-span-3 font-mono">{selectedUser.dni || "No registrado"}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Rol</Label>
                                <div className="col-span-3 capitalize">{selectedUser.role || "Estudiante"}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">ID</Label>
                                <div className="col-span-3 text-xs text-muted-foreground truncate" title={selectedUser.id}>{selectedUser.id}</div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Registro</Label>
                                <div className="col-span-3 text-sm text-muted-foreground">
                                    {selectedUser.created_at ? format(new Date(selectedUser.created_at), "PPP p", { locale: es }) : "-"}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario y todos sus datos asociados (inscripciones, progreso, certificados).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => userToDelete && deleteUserMutation.mutate(userToDelete)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteUserMutation.isPending ? "Eliminando..." : "Eliminar Usuario"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
