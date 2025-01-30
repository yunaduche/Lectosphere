import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


interface PreloaderProps {
    isLoading?: boolean;
    children: React.ReactNode;
  }

const AnimatedPreloader: React.FC<PreloaderProps> = ({ isLoading = true, children }) => {
    const [showError, setShowError] = useState(false);
    const [showPreloader, setShowPreloader] = useState(true);
  
    useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      
      if (isLoading) {
        setShowPreloader(true);
        timeoutId = setTimeout(() => {
          setShowError(true);
        }, 30000);
      } else {
   
        timeoutId = setTimeout(() => {
          setShowPreloader(false);
        }, 500); 
      }
  
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [isLoading]);

  return (
    <div className="relative w-full h-screen">
      {/* Contenu principal visible en arrière-plan */}
      <div className={`w-full h-full relative ${!showPreloader ? 'z-50' : 'z-0'}`}>
        {children}
      </div>

      {/* Préchargeur avec fond semi-transparent */}
       {showPreloader && (
        <div 
          className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#335262]/90 to-[#e7c568]/90 backdrop-blur-sm
            ${!isLoading ? 'animate-fadeOut' : ''} z-40
            flex flex-col items-center justify-center`}
        >
          {/* Message de chargement */}
          <div className="text-white text-2xl mb-8 animate-pulse">
            Chargement en cours...
          </div>


          {/* Composant étagère animée */}
          <div className="scale-75">
            <div className="relative top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ul className="relative mx-auto w-[300px] p-0">
                {/* Premier livre */}
                <li className="absolute top-[-140px] box-border list-none w-[40px] h-[140px] opacity-0 bg-white/20 border-[5px] border-white origin-bottom-left translate-x-[300px] animate-[travel_2500ms_linear_infinite] first
                  before:content-[''] before:absolute before:top-[10px] before:left-0 before:w-full before:h-[5px] before:bg-white
                  after:content-[''] after:absolute after:bottom-[10px] after:left-0 after:w-full after:h-[5px] after:bg-white" />

                {/* Deuxième livre */}
                <li className="absolute top-[-120px] box-border list-none w-[40px] h-[120px] opacity-0 bg-white/20 border-[5px] border-white origin-bottom-left translate-x-[300px] animate-[travel_2500ms_linear_infinite] [animation-delay:416.66667ms]
                  before:box-border before:content-[''] before:absolute before:top-[10px] before:left-0 before:w-full before:h-[17.5px] before:border-t-[5px] before:border-b-[5px] before:border-white
                  after:box-border after:content-[''] after:absolute after:bottom-[10px] after:left-0 after:w-full after:h-[17.5px] after:border-t-[5px] after:border-b-[5px] after:border-white" />

                {/* Troisième livre */}
                <li className="absolute top-[-120px] box-border list-none w-[40px] h-[120px] opacity-0 bg-white/20 border-[5px] border-white origin-bottom-left translate-x-[300px] animate-[travel_2500ms_linear_infinite] [animation-delay:833.33333ms]
                  before:box-border before:content-[''] before:absolute before:top-[10px] before:left-[9px] before:w-[12px] before:h-[12px] before:rounded-full before:border-[5px] before:border-white
                  after:box-border after:content-[''] after:absolute after:bottom-[10px] after:left-[9px] after:w-[12px] after:h-[12px] after:rounded-full after:border-[5px] after:border-white" />

                {/* Quatrième livre */}
                <li className="absolute top-[-130px] box-border list-none w-[40px] h-[130px] opacity-0 bg-white/20 border-[5px] border-white origin-bottom-left translate-x-[300px] animate-[travel_2500ms_linear_infinite] [animation-delay:1250ms]
                  before:box-border before:content-[''] before:absolute before:top-[46px] before:left-0 before:w-full before:h-[17.5px] before:border-t-[5px] before:border-b-[5px] before:border-white" />

                {/* Cinquième livre */}
                <li className="absolute top-[-100px] box-border list-none w-[40px] h-[100px] opacity-0 bg-white/20 border-[5px] border-white origin-bottom-left translate-x-[300px] animate-[travel_2500ms_linear_infinite] [animation-delay:1666.66667ms]
                  before:box-border before:content-[''] before:absolute before:top-[10px] before:left-0 before:w-full before:h-[17.5px] before:border-t-[5px] before:border-b-[5px] before:border-white
                  after:box-border after:content-[''] after:absolute after:bottom-[10px] after:left-0 after:w-full after:h-[17.5px] after:border-t-[5px] after:border-b-[5px] after:border-white" />

                {/* Sixième livre */}
                <li className="absolute top-[-140px] box-border list-none w-[40px] h-[140px] opacity-0 bg-white/20 border-[5px] border-white origin-bottom-left translate-x-[300px] animate-[travel_2500ms_linear_infinite] [animation-delay:2083.33333ms]
                  before:box-border before:content-[''] before:absolute before:bottom-[31px] before:left-0 before:w-full before:h-[5px] before:bg-white
                  after:box-border after:content-[''] after:absolute after:bottom-[10px] after:left-[9px] after:w-[12px] after:h-[12px] after:rounded-full after:border-[5px] after:border-white" />
              </ul>
              
              {/* Étagère avec points animés */}
              <div className="relative w-[300px] h-[5px] mx-auto bg-white
                before:content-[''] before:absolute before:w-full before:h-full before:bg-[#335262]/50 
                before:bg-[radial-gradient(rgba(255,255,255,0.5)_30%,transparent_0)] 
                before:bg-[length:10px_10px] before:bg-[position:0_-2.5px] 
                before:top-[200%] before:left-[5%] before:animate-[move_250ms_linear_infinite]
                after:content-[''] after:absolute after:w-full after:h-full after:bg-[#335262]/50 
                after:bg-[radial-gradient(rgba(255,255,255,0.5)_30%,transparent_0)] 
                after:bg-[length:10px_10px] after:bg-[position:0_-2.5px] 
                after:top-[400%] after:left-[7.5%] after:animate-[move_250ms_linear_infinite]" />
            </div>
          </div>

          {/* Message d'erreur */}
          {showError && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-md animate-slideUp">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur de chargement</AlertTitle>
                <AlertDescription>
                  Le chargement prend plus de temps que prévu. Veuillez rafraîchir la page ou réessayer plus tard.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
       @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

          .animate-fadeOut {
          animation: fadeOut 0.5s ease-out forwards;
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 100%); }
          to { transform: translate(-50%, 0); }
        }

        @keyframes move {
          from { background-position-x: 0; }
          to { background-position-x: 10px; }
        }
        
        @keyframes travel {
          0% {
            opacity: 0;
            transform: translateX(300px) rotateZ(0deg) scaleY(1);
          }
          6.5% {
            transform: translateX(279.5px) rotateZ(0deg) scaleY(1.1);
          }
          8.8% {
            transform: translateX(273.6px) rotateZ(0deg) scaleY(1);
          }
          10% {
            opacity: 1;
            transform: translateX(270px) rotateZ(0deg);
          }
          17.6% {
            transform: translateX(247.2px) rotateZ(-30deg);
          }
          45% {
            transform: translateX(165px) rotateZ(-30deg);
          }
          49.5% {
            transform: translateX(151.5px) rotateZ(-45deg);
          }
          61.5% {
            transform: translateX(115.5px) rotateZ(-45deg);
          }
          67% {
            transform: translateX(99px) rotateZ(-60deg);
          }
          76% {
            transform: translateX(72px) rotateZ(-60deg);
          }
          83.5% {
            opacity: 1;
            transform: translateX(49.5px) rotateZ(-90deg);
          }
          90% {
            opacity: 0;
          }
          100% {
            opacity: 0;
            transform: translateX(0px) rotateZ(-90deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedPreloader;