import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Mistral } from '@mistralai/mistralai';

const KeywordGenerator = () => {
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateKeywords = async () => {
    if (!description.trim()) {
      setError('Veuillez entrer une description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
      const client = new Mistral({ apiKey });
      
      const chatResponse = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ 
          role: 'user', 
          content: `Generate 7 keywords from the following book description giving only the keywords : ${description}` 
        }],
      });

      if (chatResponse.choices?.[0]?.message?.content) {
        const generatedKeywords = chatResponse.choices[0].message.content
          .split(',')
          .map(keyword => `#${keyword.trim()}`);
        setKeywords(generatedKeywords);
      } else {
        throw new Error('La réponse de l\'API ne contient pas les données attendues');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération des mots-clés');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Générateur de Mots-Clés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Entrez la description du livre..."
            className="min-h-32 resize-none"
          />
        </div>

        <Button 
          onClick={handleGenerateKeywords} 
          disabled={loading} 
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            'Générer les mots-clés'
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {keywords.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Mots-Clés Générés:</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-sm py-1 px-3"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordGenerator;