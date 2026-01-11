import { Medication, medicationService } from '@/lib/medication-service';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './use-auth';

export function useMedications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = useCallback(async () => {
    if (!user?.id) {
      setMedications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await medicationService.getUserMedications(user.id);
      setMedications(data);
      console.log('[useMedications] Loaded medications:', data.length);
    } catch (err) {
      console.error('[useMedications] Error fetching medications:', err);
      setError('Failed to load medications');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return { medications, loading, error, refetch: fetchMedications };
}
