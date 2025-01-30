
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Annonce } from './typess';

export default function AnnonceList() {
    const [annonces, setAnnonces] = useState<Annonce[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAnnonce, setNewAnnonce] = useState({
        objet: '',
        contenu: ''
    });

    useEffect(() => {
        fetchAnnonces();
    }, []);

    const fetchAnnonces = async () => {
        try {
            const response = await fetch('/api/annonce');
            const data = await response.json();
            setAnnonces(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des annonces:', error);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await fetch(`/api/annonce/${id}`, {
                method: 'DELETE'
            });
            await fetchAnnonces();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/annonce', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAnnonce)
            });
            setIsModalOpen(false);
            setNewAnnonce({ objet: '', contenu: '' });
            await fetchAnnonces();
        } catch (error) {
            console.error('Erreur lors de la création:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Liste des annonces</h2>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#335262] text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle annonce
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une nouvelle annonce</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <Input
                                    placeholder="Titre de l'annonce"
                                    value={newAnnonce.objet}
                                    onChange={(e) => setNewAnnonce({
                                        ...newAnnonce,
                                        objet: e.target.value
                                    })}
                                />
                            </div>
                            <div>
                                <Textarea
                                    placeholder="Contenu de l'annonce"
                                    value={newAnnonce.contenu}
                                    onChange={(e) => setNewAnnonce({
                                        ...newAnnonce,
                                        contenu: e.target.value
                                    })}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-[#335262] text-white">
                                Créer
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#335262] text-white">
                        <TableRow>
                            <TableHead className="w-12 text-white">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds(annonces.map(a => a.id));
                                        } else {
                                            setSelectedIds([]);
                                        }
                                    }}
                                />
                            </TableHead>
                            <TableHead className="text-white">Titre</TableHead>
                            <TableHead className="text-white">Date de publication</TableHead>
                            <TableHead className="text-white">Contenu</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='bg-white'>
                        {annonces.map((annonce) => (
                            <TableRow
                                key={annonce.id}
                                className="cursor-pointer  transition-colors"
                            >
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={selectedIds.includes(annonce.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedIds([...selectedIds, annonce.id]);
                                            } else {
                                                setSelectedIds(selectedIds.filter(id => id !== annonce.id));
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-gray-900">
                                        {annonce.objet}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="bg-[#335262] text-white">
                                        {formatDate(annonce.date_publication)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="max-w-md">
                                    <div className="truncate">
                                        {annonce.contenu}
                                    </div>
                                    
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-red-600"
                                        onClick={(e) => handleDelete(annonce.id, e)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}