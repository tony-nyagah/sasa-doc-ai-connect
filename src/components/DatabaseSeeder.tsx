import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { seedDoctors } from '@/scripts/seedDoctors';

const DatabaseSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSeedDoctors = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await seedDoctors();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to seed doctors');
      console.error('Seeding error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-medical-primary" />
            Database Seeder
          </CardTitle>
          <CardDescription>
            Add sample doctors data to your database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully seeded 20 doctors across 10 Kenyan cities!
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSeedDoctors}
            disabled={loading}
            className="w-full medical-gradient text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Seed Doctors Data
              </>
            )}
          </Button>

          <div className="text-sm text-gray-600">
            <p>This will create:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>20 doctors with profiles</li>
              <li>Spread across 10 Kenyan cities</li>
              <li>Various specialties and experience levels</li>
              <li>Realistic names and contact information</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSeeder;
