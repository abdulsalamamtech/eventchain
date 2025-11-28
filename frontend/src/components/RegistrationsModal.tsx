import { useGetEvent, useGetRegistrations } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download, Users } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationsModalProps {
  eventId: string;
  onClose: () => void;
}

export default function RegistrationsModal({ eventId, onClose }: RegistrationsModalProps) {
  const { data: event } = useGetEvent(eventId);
  const { data: registrations = [], isLoading } = useGetRegistrations(eventId);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Registration Date'];
    const rows = registrations.map(reg => [
      reg.name,
      reg.email,
      new Date(Number(reg.registrationDate) / 1000000).toLocaleString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.title || 'event'}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Registrations exported to CSV');
  };

  const exportToJSON = () => {
    const data = registrations.map(reg => ({
      name: reg.name,
      email: reg.email,
      registrationDate: new Date(Number(reg.registrationDate) / 1000000).toISOString()
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.title || 'event'}-registrations.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Registrations exported to JSON');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Event Registrations
          </DialogTitle>
          {event && (
            <p className="text-sm text-muted-foreground">{event.title}</p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {registrations.length} {registrations.length === 1 ? 'registration' : 'registrations'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportToJSON}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No registrations yet</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>
                        {new Date(Number(reg.registrationDate) / 1000000).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
