
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BookInfo } from '../../hooks-redux/type/NoticeTypes';

interface FormInputProps {
  field: keyof BookInfo;
  label: string;
  icon: React.ElementType;
  value: string | number | string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  onGenerateKeywords?: () => void;
  isGeneratingKeywords?: boolean;
  keywordError?: string | null;
}

export const FormInput: React.FC<FormInputProps> = ({
  field,
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  onGenerateKeywords,
  isGeneratingKeywords,
  keywordError
}) => (
  <div className="space-y-1">
    <Label htmlFor={field} className="text-sm font-medium text-gray-700 flex justify-between items-center">
      <span>{label}</span>
      {field === 'mots_cle' && isGeneratingKeywords && (
        <span className="text-blue-500 text-xs flex items-center">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Génération en cours...
        </span>
      )}
    </Label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      {field === 'mots_cle' ? (
        <div className="flex gap-2">
          <Input
            type={type}
            id={field}
            name={field}
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={onChange}
            className="pl-9 text-sm"
            placeholder={placeholder || `Saisir ${label.toLowerCase()}`}
            disabled={disabled}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onGenerateKeywords}
            disabled={isGeneratingKeywords}
          >
            Générer
          </Button>
        </div>
      ) : (
        <Input
          type={type}
          id={field}
          name={field}
          value={Array.isArray(value) ? value.join(', ') : value}
          onChange={onChange}
          className="pl-9 text-sm"
          placeholder={placeholder || `Saisir ${label.toLowerCase()}`}
        />
      )}
    </div>
    {field === 'mots_cle' && keywordError && (
      <p className="text-xs text-red-500 mt-1">{keywordError}</p>
    )}
  </div>
);

export const TitleInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck: () => void;
}> = ({ value, onChange, onCheck }) => (
  <div className="space-y-1">
    <Label htmlFor="titre" className="text-sm font-medium text-gray-700">Titre</Label>
    <div className="flex">
      <div className="relative flex-1">
        <div className="absolute top-2 left-2 pointer-events-none">
          <Book className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          id="titre"
          name="titre"
          value={value}
          onChange={onChange}
          className="pl-8"
          placeholder="Titre du livre"
        />
      </div>
      <Button
        type="button"
        onClick={onCheck}
        disabled={!value}
        className="ml-2"
        variant="outline"
      >
        Vérifier
      </Button>
    </div>
  </div>
);