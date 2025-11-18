import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import trainerBg from "@/assets/trainer-background.png";

interface Machine {
  id: string;
  name: string;
  muscles: string[];
  notes?: string;
  image_url?: string;
}

const WorkoutList = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", muscles: "", notes: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load machines');
      console.error(error);
    } else {
      setMachines(data || []);
    }
  };

  const handleEdit = (machine: Machine) => {
    setEditingId(machine.id);
    setEditForm({
      name: machine.name,
      muscles: machine.muscles.join(', '),
      notes: machine.notes || ''
    });
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('machines')
      .update({
        name: editForm.name,
        muscles: editForm.muscles.split(',').map(m => m.trim()).filter(Boolean),
        notes: editForm.notes
      })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update machine');
      console.error(error);
    } else {
      toast.success('Machine updated!');
      setEditingId(null);
      fetchMachines();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete machine');
      console.error(error);
    } else {
      toast.success('Machine deleted');
      fetchMachines();
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: `url(${trainerBg})`,
        backgroundSize: 'contain'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-start">
          {/* Left side - empty for character */}
          <div className="w-1/2"></div>
          
          {/* Right side - content */}
          <div className="w-1/2 pr-12">
            <div className="mb-6 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Door
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Machine
              </Button>
            </div>

            <div className="text-left mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                My Workout Machines
              </h1>
              <p className="text-muted-foreground">
                Track and manage your gym equipment
              </p>
            </div>

            <div className="space-y-4">
          {machines.length === 0 ? (
            <Card className="p-12 text-center bg-background/90 backdrop-blur-sm">
              <p className="text-muted-foreground mb-4">
                No machines added yet. Upload a machine photo to get started!
              </p>
              <Button onClick={() => navigate('/')}>
                Upload First Machine
              </Button>
            </Card>
          ) : (
            machines.map((machine) => (
              <Card key={machine.id} className="p-6 bg-background/90 backdrop-blur-sm">
                {editingId === machine.id ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Machine name"
                      className="text-lg font-semibold"
                    />
                    <Input
                      value={editForm.muscles}
                      onChange={(e) => setEditForm({ ...editForm, muscles: e.target.value })}
                      placeholder="Muscles (comma separated)"
                    />
                    <Textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Notes (optional)"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(machine.id)} size="sm">
                        Save
                      </Button>
                      <Button 
                        onClick={() => setEditingId(null)} 
                        variant="outline" 
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-foreground">
                        {machine.name}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(machine)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(machine.id)}
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        Target Muscles:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {machine.muscles.map((muscle, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/20 text-foreground rounded-full text-sm"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    {machine.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          {machine.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;