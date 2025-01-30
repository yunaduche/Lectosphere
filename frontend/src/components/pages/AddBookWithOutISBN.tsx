import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RootState } from '../../hooks-redux/store';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Book, Library } from 'lucide-react';

interface BookFormData {
  titre: string;
  auteurs: string;
  editeurs: string;
  format: 'lecture sur place' | 'empruntable';
  date_publication: string;
  nombre_pages: number;
  categorie: string;
  langue: string;
  mots_cle: string;
  description: string;
  url_photo: string;
}

interface Book {
  isbn: string;
  titre: string;
}

const AddBookWithoutISBN: React.FC = () => {
  const [formData, setFormData] = useState<BookFormData>({
    titre: '',
    auteurs: '',
    editeurs: '',
    format: 'empruntable',
    date_publication: '',
    nombre_pages: 0,
    categorie: '',
    langue: '',
    mots_cle: '',
    description: '',
    url_photo: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (books.length >= 1 && !showModal) {
      setShowModal(true);
    }
  }, [books]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/books/add-with-generated-barcode',
        {
          bookInfo: {
            ...formData,
            auteurs: formData.auteurs.split(',').map(a => a.trim()),
            editeurs: formData.editeurs.split(',').map(e => e.trim()),
            mots_cle: formData.mots_cle.split(',').map(m => m.trim()),
          },
          username: user.username
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const newBook: Book = {
        isbn: response.data.generatedBarcode,
        titre: formData.titre
      };

      setBooks(prevBooks => [...prevBooks, newBook]);
      setMessage({ type: 'success', text: 'Livre ajouté avec succès.' });
      setFormData({
        titre: '',
        auteurs: '',
        editeurs: '',
        format: 'empruntable',
        date_publication: '',
        nombre_pages: 0,
        categorie: '',
        langue: '',
        mots_cle: '',
        description: '',
        url_photo: '',
      });

      toast({
        title: "Livre ajouté",
        description: `${newBook.titre} a été ajouté avec succès.`,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setMessage({ type: 'error', text: 'Erreur lors de l\'ajout du livre : ' + errorMessage });
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
      } else {
        setMessage({ type: 'error', text: 'Une erreur inattendue s\'est produite' });
      }
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 6;
    const barcodeWidth = (pageWidth - 1 * margin) / 3;
    const barcodeHeight = 32; // Hauteur du code-barres ajustée
    const titleHeight = 6; // Hauteur du titre
    const spacing = 2; // Espacement réduit entre le titre et le code-barres

    books.forEach((book, index) => {
        if (index > 0 && index % 15 === 0) {
            pdf.addPage();
        }

        const col = index % 3;
        const row = Math.floor((index % 15) / 3);

        const x = margin + col * (barcodeWidth + margin);
        const y = margin + row * (barcodeHeight + titleHeight + spacing + 5);

        // Ajout du titre
        pdf.setFontSize(12);
        pdf.setFont('bold');
        const titleWidth = pdf.getTextWidth(book.titre);
        const titleX = x + (barcodeWidth / 2) - (titleWidth / 2);
        pdf.text(book.titre, titleX, y + titleHeight);

        // Création du code-barres
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, book.isbn, {
            format: "CODE128",
            width: 12, // Ajusté pour élargir les barres
            height: barcodeHeight, // Ajusté pour laisser plus d'espace aux chiffres
            displayValue: false, // Désactivé pour éviter le chevauchement
            fontSize: 12, // Ajusté pour rendre les chiffres plus visibles
            textMargin: 0,
            marginTop: 0,
            marginBottom: 0
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', x, y + titleHeight + spacing, barcodeWidth, barcodeHeight);

        // Ajout des chiffres ISBN sous le code-barres
        pdf.setFontSize(12);
        pdf.text(book.isbn, x + (barcodeWidth / 2), y + titleHeight + spacing + barcodeHeight + 2, { align: 'center' });
    });

    pdf.save('barcodes.pdf');
    setShowModal(false);
    setBooks([]);
    toast({
        title: "Téléchargement réussi",
        description: "Les codes-barres ont été téléchargés avec succès. Le compteur a été réinitialisé.",
    });
};

  return (
    <div className="min-h-screen bg-white p-8">
      <Card className="max-w-3xl mx-auto shadow-lg border-t-4 border-[#335262]">
        <CardHeader className="space-y-1 bg-[#335262] text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Library className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Ajouter un livre sans ISBN</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="titre" className="text-[#335262]">Titre</Label>
                <Input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className="border-[#335262] focus:ring-[#e7c568]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auteurs" className="text-[#335262]">Auteurs</Label>
                <Input
                  type="text"
                  id="auteurs"
                  name="auteurs"
                  value={formData.auteurs}
                  onChange={handleChange}
                  className="border-[#335262] focus:ring-[#e7c568]"
                  placeholder="Séparés par des virgules"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editeurs" className="text-[#335262]">Éditeurs</Label>
                <Input
                  type="text"
                  id="editeurs"
                  name="editeurs"
                  value={formData.editeurs}
                  onChange={handleChange}
                  className="border-[#335262] focus:ring-[#e7c568]"
                  placeholder="Séparés par des virgules"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format" className="text-[#335262]">Format</Label>
                <select
                  id="format"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="w-full rounded-md border-[#335262] focus:ring-[#e7c568]"
                  required
                >
                  <option value="empruntable">Empruntable</option>
                  <option value="lecture sur place">Lecture sur place</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_publication" className="text-[#335262]">Date de publication</Label>
                <Input
                  type="date"
                  id="date_publication"
                  name="date_publication"
                  value={formData.date_publication}
                  onChange={handleChange}
                  className="border-[#335262] focus:ring-[#e7c568]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre_pages" className="text-[#335262]">Nombre de pages</Label>
                <Input
                  type="number"
                  id="nombre_pages"
                  name="nombre_pages"
                  value={formData.nombre_pages}
                  onChange={handleChange}
                  className="border-[#335262] focus:ring-[#e7c568]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categorie" className="text-[#335262]">Catégorie</Label>
                <Input
                  type="text"
                  id="categorie"
                  name="categorie"
                  value={formData.categorie}
                  onChange={handleChange}
                  className="border-[#335262] focus:ring-[#e7c568]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="langue" className="text-[#335262]">Langue</Label>
                <Input
                  type="text"
                  id="langue"
                  name="langue"
                  value={formData.langue}
                  onChange={handleChange}
                  className="border-[#335262] focus:ring-[#e7c568]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mots_cle" className="text-[#335262]">Mots-clés</Label>
              <Input
                type="text"
                id="mots_cle"
                name="mots_cle"
                value={formData.mots_cle}
                onChange={handleChange}
                className="border-[#335262] focus:ring-[#e7c568]"
                placeholder="Séparés par des virgules"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#335262]">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border-[#335262] focus:ring-[#e7c568]"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url_photo" className="text-[#335262]">URL de la photo</Label>
              <Input
                type="url"
                id="url_photo"
                name="url_photo"
                value={formData.url_photo}
                onChange={handleChange}
                className="border-[#335262] focus:ring-[#e7c568]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#335262] hover:bg-[#e7c568] hover:text-[#335262] transition-colors duration-200"
            >
              <Book className="w-4 h-4 mr-2" />
              Ajouter le livre
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#335262]">15 livres ajoutés</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez ajouté 15 livres. Voulez-vous télécharger les codes-barres en PDF maintenant ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={generatePDF} 
              className="bg-[#335262] hover:bg-[#e7c568] hover:text-[#335262]"
            >
              Télécharger les codes-barres
            </Button>
            <Button 
              onClick={() => setShowModal(false)} 
              variant="outline" 
              className="border-[#335262] text-[#335262] hover:bg-[#335262] hover:text-white"
            >
              Plus tard
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddBookWithoutISBN;