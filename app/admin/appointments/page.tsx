'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';
import { mockAppointments, Appointment } from '@/lib/mockData';
import AppointmentsTable from '@/components/admin/appointments/appointments-table';
import AppointmentForm from '@/components/admin/appointments/appointment-form';
import { showToast } from '@/lib/toast';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    showToast.success('Appointment deleted successfully');
  };

  const handleSubmitAppointment = (appointmentData: Partial<Appointment>) => {
    if (selectedAppointment) {
      // Update existing appointment
      setAppointments(appointments.map(appointment => 
        appointment.id === selectedAppointment.id 
          ? { ...appointment, ...appointmentData }
          : appointment
      ));
      showToast.success('Appointment updated successfully');
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        referenceNumber: `APT-${new Date().getFullYear()}-${String(appointments.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        ...appointmentData
      } as Appointment;
      setAppointments([newAppointment, ...appointments]);
      showToast.success('Appointment created successfully');
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments Management</h1>
          <p className="text-muted-foreground">
            Manage citizen appointments and bookings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddAppointment}>
            <Plus className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments ({appointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsTable
            appointments={appointments}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
          />
        </CardContent>
      </Card>

      <AppointmentForm
        appointment={selectedAppointment}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmitAppointment}
      />
    </div>
  );
}