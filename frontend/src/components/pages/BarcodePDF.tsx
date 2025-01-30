import React, { useEffect, useState, useRef } from 'react';
import Barcode from 'react-barcode';
import { usePDF } from 'react-to-pdf';
import { Button } from "@/components/ui/button";
import { Printer } from 'lucide-react';

interface Exemplaire {
  id_exemplaire: number;
  titre: string;
  code_barre: string;
  isbn: string;
}

interface BarcodesPrintingProps {
  selectedExemplaires: Exemplaire[];
  maxBarcodes?: number;
}

const BarcodesPrinting: React.FC<BarcodesPrintingProps> = ({ 
  selectedExemplaires,
  maxBarcodes = 20
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [barcodesReady, setBarcodesReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { toPDF, targetRef } = usePDF({
    filename: 'codes-barres.pdf',
    page: { 
      margin: 10,
      format: 'A4',
      orientation: 'portrait'
    }
  });

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 20;
    
    const checkBarcodes = () => {
      if (!mounted) return;
      if (containerRef.current?.querySelectorAll('svg').length === selectedExemplaires.length) {
        setBarcodesReady(true);
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(checkBarcodes, 100);
      } else {
        setBarcodesReady(false);
      }
    };

    setBarcodesReady(false);
    setTimeout(checkBarcodes, 100);
    return () => { mounted = false; };
  }, [selectedExemplaires]);

  const handleGeneratePDF = async () => {
    if (!barcodesReady) return;
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await toPDF();
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTitle = (titre: string | null | undefined) => {
    if (!titre) return '(Sans titre)';
    if (titre.length > 40) {
      return titre.substring(0, 37) + '...';
    }
    return titre;
  };

  return (
    <>
      {/* Bouton d'impression */}
      <Button
        variant="default"
        onClick={handleGeneratePDF}
        disabled={isGenerating || !barcodesReady}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        {isGenerating 
          ? 'Génération...' 
          : !barcodesReady 
            ? 'Préparation...' 
            : `Imprimer (${selectedExemplaires.length})`
        }
      </Button>

      {/* Contenu caché pour la génération PDF */}
      <div style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: '210mm',
        height: 0,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none'
      }}>
        <div 
          ref={targetRef}
          className="w-[210mm] min-h-[297mm] bg-white"
        >
          <div 
            ref={containerRef}
            className="grid grid-cols-4 gap-4 p-8"
          >
            {selectedExemplaires.map((exemplaire) => (
              <div 
                key={exemplaire.id_exemplaire}
                className="flex flex-col items-center justify-between h-[50mm] p-2 rounded-lg border border-gray-200"
              >
                <div className="w-full flex flex-col items-center justify-between h-full">
                  <div className="w-full mb-2">
                    <div className="text-[14px] text-center font-medium min-h-[24px] px-1 leading-tight">
                      {formatTitle(exemplaire.titre)}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex items-center justify-center">
                    {exemplaire.code_barre ? (
                      <Barcode
                        value={exemplaire.code_barre}
                        width={1}
                        height={40}
                        fontSize={14}
                        margin={0}
                        displayValue={true}
                      />
                    ) : (
                      <div className="text-[8px] text-red-500">Code-barres manquant</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BarcodesPrinting;