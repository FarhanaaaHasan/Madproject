import { Medication, medicationService } from '@/lib/medication-service';
import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';

export function useMedications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setMedications([]);
      setLoading(false);
      return;
    }

    const fetchMedications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await medicationService.getUserMedications(user.uid);
        setMedications(data);
      } catch (err) {
        console.error('[useMedications] Error fetching medications:', err);
        setError('Failed to load medications');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user?.uid]);

  return { medications, loading, error, refetch: () => user?.uid && medicationService.getUserMedications(user.uid) };
}
