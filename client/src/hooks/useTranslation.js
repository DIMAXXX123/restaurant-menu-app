import { useContext } from 'react';
import { TranslationContext } from '../context/TranslationContext';

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within a TranslationProvider');
  return ctx;
}
