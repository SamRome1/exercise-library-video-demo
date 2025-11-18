import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, ArrowLeft, Loader2 } from "lucide-react";
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
  const [editForm, setEditForm] = useState({
    name: "",
    muscles: "",
    notes: ""
  });
  const [workoutGoals, setWorkoutGoals] = useState<Record<string, string>>({});
  const [loadingMachineId, setLoadingMachineId] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [exercisesReady, setExercisesReady] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMachines();
  }, []);
  const fetchMachines = async () => {
    const {
      data,
      error
    } = await supabase.from('machines').select('*').order('created_at', {
      ascending: false
    });
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
    const {
      error
    } = await supabase.from('machines').update({
      name: editForm.name,
      muscles: editForm.muscles.split(',').map(m => m.trim()).filter(Boolean),
      notes: editForm.notes
    }).eq('id', id);
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
    const {
      error
    } = await supabase.from('machines').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete machine');
      console.error(error);
    } else {
      toast.success('Machine deleted');
      fetchMachines();
    }
  };

  const handleGenerateExercises = async (machine: Machine) => {
    const workoutGoal = workoutGoals[machine.id];
    if (!workoutGoal || !workoutGoal.trim()) {
      toast.error('Please enter what you want to work out');
      return;
    }

    setLoadingMachineId(machine.id);
    setShowVideo(true);
    setVideoEnded(false);
    setExercisesReady(null);
    
    // Video will autoplay when mounted

    // Generate exercises in parallel
    try {
      const { data, error } = await supabase.functions.invoke('generate-exercises', {
        body: {
          machineName: machine.name,
          muscles: machine.muscles,
          workoutGoal: workoutGoal
        }
      });

      if (error) {
        console.error('Error generating exercises:', error);
        toast.error('Failed to generate exercises');
        setShowVideo(false);
        setLoadingMachineId(null);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        setShowVideo(false);
        setLoadingMachineId(null);
        return;
      }

      // Store the results
      setExercisesReady({
        exercises: data.exercises,
        machineName: machine.name,
        workoutGoal: workoutGoal
      });

      // If video already ended, navigate immediately
      if (videoEnded) {
        navigate('/exercises', {
          state: {
            exercises: data.exercises,
            machineName: machine.name,
            workoutGoal: workoutGoal
          }
        });
        setShowVideo(false);
        setLoadingMachineId(null);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
      setShowVideo(false);
      setLoadingMachineId(null);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // If exercises are ready, navigate immediately
    if (exercisesReady) {
      navigate('/exercises', {
        state: exercisesReady
      });
      setShowVideo(false);
      setLoadingMachineId(null);
    }
  };
  return <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{
    backgroundImage: `url(${trainerBg})`,
    backgroundSize: 'contain'
  }}>
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src="/gainz-video.mp4"
            className="w-full h-full object-contain"
            onEnded={handleVideoEnd}
            autoPlay
            playsInline
            muted
            onError={(e) => console.error('Video error:', e)}
          />
        </div>
      )}
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-start">
          {/* Left side - empty for character */}
          <div className="w-1/2"></div>
          
          {/* Right side - content */}
          <div className="w-1/2 pr-12">
            <div className="mb-6 flex items-center justify-center">
              <Button variant="secondary" size="sm" onClick={() => navigate('/')} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Door
              </Button>
            </div>

            <div className="text-left mb-8 mt-24 ml-[23%]">
              <h1 className="text-lg font-bold text-black mb-2">
                Machine:
              </h1>
            </div>

            <div className="space-y-2 max-w-[280px] ml-[9%] mt-[1%]">
          {machines.length === 0 ? <Card className="p-6 text-center bg-background/90 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground mb-3">
                No machines added yet. Upload a machine photo to get started!
              </p>
              <Button onClick={() => navigate('/')} size="sm">
                Upload First Machine
              </Button>
            </Card> : machines.map(machine => <Card key={machine.id} className="p-2 backdrop-blur-sm bg-[#fef7ea]">
                {editingId === machine.id ? <div className="space-y-2">
                    <Input value={editForm.name} onChange={e => setEditForm({
                  ...editForm,
                  name: e.target.value
                })} placeholder="Machine name" className="text-sm font-semibold h-8" />
                    <Input value={editForm.muscles} onChange={e => setEditForm({
                  ...editForm,
                  muscles: e.target.value
                })} placeholder="Muscles (comma separated)" className="text-xs h-8" />
                    <Textarea value={editForm.notes} onChange={e => setEditForm({
                  ...editForm,
                  notes: e.target.value
                })} placeholder="Notes (optional)" rows={2} className="text-xs" />
                    <div className="flex gap-1">
                      <Button onClick={() => handleSave(machine.id)} size="sm" className="h-7 text-xs">
                        Save
                      </Button>
                      <Button onClick={() => setEditingId(null)} variant="outline" size="sm" className="h-7 text-xs">
                        Cancel
                      </Button>
                    </div>
                  </div> : <div>
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-slate-950">
                        {machine.name}
                      </h3>
                      <div className="flex gap-1">
                        <Button onClick={() => handleEdit(machine)} variant="outline" size="sm" className="gap-1 h-6 px-1.5 bg-amber-300 hover:bg-amber-200 text-slate-950">
                          <Pencil className="w-2.5 h-2.5" />
                          <span className="text-[10px]">Edit</span>
                        </Button>
                        <Button onClick={() => handleDelete(machine.id)} variant="destructive" size="sm" className="gap-1 h-6 px-1.5 bg-red-600 hover:bg-red-500 text-slate-950">
                          <Trash2 className="w-2.5 h-2.5" />
                          <span className="text-[10px]">Delete</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mb-1.5">
                      <p className="text-[10px] mb-0.5 text-slate-950">
                        Generally used for:
                      </p>
                      <div className="flex flex-wrap gap-0.5">
                        {machine.muscles.map((muscle, idx) => <span key={idx} className="px-1.5 py-0.5 bg-primary/20 rounded-full text-[10px] text-slate-950">
                            {muscle}
                          </span>)}
                      </div>
                    </div>

                    {machine.notes && <div className="mt-1.5 p-1.5 bg-muted/50 rounded-lg">
                        <p className="text-[10px] text-muted-foreground">
                          {machine.notes}
                        </p>
                      </div>}

                    <div className="mt-2">
                      <label className="text-[10px] text-slate-950 mb-0.5 block">
                        What do you want to work out?
                      </label>
                      <Input value={workoutGoals[machine.id] || ''} onChange={e => setWorkoutGoals({
                    ...workoutGoals,
                    [machine.id]: e.target.value
                  })} placeholder="Enter your workout goal..." className="text-xs h-7 bg-transparent border-black text-black" />
                      <Button 
                        onClick={() => handleGenerateExercises(machine)}
                        disabled={loadingMachineId === machine.id}
                        className="mt-1.5 w-full text-[10px] h-6" 
                        size="sm"
                      >
                        {loadingMachineId === machine.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Gainz'
                        )}
                      </Button>
                    </div>
                  </div>}
              </Card>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default WorkoutList;