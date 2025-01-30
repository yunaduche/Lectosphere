import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import JsBarcode from 'jsbarcode';
import logo from './logo.png';

interface Member {
  nom: string;
  prenom: string;
  fin_adhesion: string;
  numeroCarte: string;
  photo: string;
  codebarre: number;
  
}

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const frontRef = React.useRef<HTMLDivElement>(null);
  const backRef = React.useRef<HTMLDivElement>(null);
  const barcodeRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, member.codebarre, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: false
      });
    }
  }, [member.codebarre]);

  const generatePDF = async () => {
    if (frontRef.current && backRef.current) {
      const frontCanvas = await html2canvas(frontRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      const backCanvas = await html2canvas(backRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [60, 95]
      });

      pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, 95, 60);
      pdf.addPage([60, 95], 'landscape');
      pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, 95, 60);

      pdf.save(`${member.nom}_${member.prenom}_card.pdf`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Front of the card */}
      <Card className="w-[380px] h-[240px] bg-gradient-to-br from-white to-gray-100 relative overflow-hidden border-2 border-red-600 rounded-xl mb-4" ref={frontRef}>
      {/* Background geometric shapes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 h-48 bg-red-500 rounded-full -translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 rounded-full translate-x-24 translate-y-24"></div>
      </div>
     
      {/* Top section with logo and year */}
      <div className="absolute top-0 left-0 right-0 h-12 flex justify-between items-center px-4 bg-white bg-opacity-80">
        <h5 className="text-red-600 font-bold text-2xl">2024</h5>
        <img src={logo} alt="Logo" className="h-8" />
      </div>
      {/* Main content */}
      <div className="pt-14 px-4 flex h-[calc(100%-3rem)]">
        {/* Left column: Photo */}
        <div className="w-1/3 pr-4 flex items-center">
          <div className="w-28 h-32 bg-gray-200 rounded-lg overflow-hidden shadow-md">
            {member.photo ? (
              <img src={member.photo} alt="Photo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Photo</div>
            )}
          </div>
        </div>
        {/* Right column: Member information */}
        <div className="w-2/3 flex flex-col justify-between">
          <div className="space-y-1">
            <div>
              <p className="font-bold text-lg">{member.nom} {member.prenom}</p>
            </div>
         
            <div>
           
              <p className="font-bold text-base">{member.numeroCarte}</p>
            </div>
          </div>
         
          {/* Barcode */}
          <div className="flex justify-end items-end mt-2 h-16 pr-0.3">
            <svg ref={barcodeRef} className="w-5/6"></svg>
          </div>
        </div>
      </div>
      {/* Bottom section with validity */}
      <div className="absolute bottom-2 left-2 text-xs leading-tight">
        <p>Valable jusqu'au {member.fin_adhesion}</p>
      </div>
    </Card>

      {/* Back of the card */}
      <Card className="w-[380px] h-[240px] bg-gradient-to-br from-white to-gray-100 relative overflow-hidden border-2 border-red-600 rounded-xl mb-4" ref={backRef}>
        {/* Background geometric shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-500 rounded-full translate-x-24 -translate-y-24"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 rounded-full -translate-x-24 translate-y-24"></div>
        </div>
        <div className="p-2 text-[9px] leading-tight relative z-10">
        
          <p className="mb-1 text-bold">Cette carte atteste de votre adhésion à l'Alliance Française pour l'année en cours.</p>
          <h3 className="font-bold mb-1">Avantages de l'adhésion</h3>
          <ul className="list-disc pl-4 mb-2">
            <li>Emprunt de livres à la bibliothèque</li>
            <li>Accès aux projections vidéo et à la ludothèque</li>
            <li>Inscription aux cours et examens DELF/DALF</li>
            <li>Accès à Culturethèque et au cyber AF</li>
            <li>Pour les membres majeurs : droit de vote à l'Assemblée Générale et éligibilité au Comité</li>
          </ul>
          <p className="mb-2">L'ALLIANCE FRANÇAISE promeut les cultures malgache et francophone. Votre adhésion soutient cette mission.</p>
          <h3 className="font-bold mb-1">Règles importantes</h3>
          <ol className="list-decimal pl-4">
            <li>Prenez soin des ouvrages empruntés.</li>
            <li>Signalez tout changement d'adresse.</li>
            <li>Respectez les délais de retour (amendes applicables).</li>
            <li>En cas de perte/détérioration, remplacez l'ouvrage par un équivalent.</li>
          </ol>
          <p className="mt-1 italic">Votre adhésion vous engage à respecter ce règlement.</p>
        </div>
      </Card>

      <Button onClick={generatePDF} className="mt-4 bg-red-600 hover:bg-red-700 text-white">Imprimer la carte (Recto-Verso)</Button>
    </div>
  );
};

export default MemberCard;