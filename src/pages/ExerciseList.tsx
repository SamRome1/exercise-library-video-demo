import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import gymBg from "@/assets/gym-character-background.png";

interface Exercise {
  name: string;
  description: string;
  sets: string;
  reps: string;
  rest: string;
  tips: string;
  youtubeSearch: string;
}

const ExerciseList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exercises, machineName, workoutGoal } = location.state || {};

  if (!exercises || !machineName) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" 
           style={{ backgroundImage: `url(${gymBg})`, backgroundSize: 'contain' }}>
        <Card className="p-6 bg-background/90 backdrop-blur-sm">
          <p className="text-muted-foreground mb-4">No exercise data found</p>
          <Button onClick={() => navigate('/workout-list')}>
            Back to Machines
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" 
         style={{ backgroundImage: `url(${gymBg})`, backgroundSize: 'contain' }}>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-center">
          <Button variant="secondary" size="sm" onClick={() => navigate('/workout-list')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Machines
          </Button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-black mb-1">
            {machineName} - Exercises
          </h1>
          <p className="text-sm text-black">
            Goal: {workoutGoal}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {exercises.map((exercise: Exercise, index: number) => (
            <Card key={index} className="p-3 backdrop-blur-sm bg-[#fef7ea]">
              <div className="mb-2">
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeSearch)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-slate-950 hover:text-primary underline mb-1 block cursor-pointer"
                >
                  {index + 1}. {exercise.name}
                </a>
                <p className="text-xs text-slate-950 mb-2">
                  {exercise.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-primary/20 rounded px-2 py-1">
                  <p className="text-[10px] font-semibold text-slate-950">Sets</p>
                  <p className="text-xs text-slate-950">{exercise.sets}</p>
                </div>
                <div className="bg-primary/20 rounded px-2 py-1">
                  <p className="text-[10px] font-semibold text-slate-950">Reps</p>
                  <p className="text-xs text-slate-950">{exercise.reps}</p>
                </div>
                <div className="bg-primary/20 rounded px-2 py-1">
                  <p className="text-[10px] font-semibold text-slate-950">Rest</p>
                  <p className="text-xs text-slate-950">{exercise.rest}</p>
                </div>
              </div>

              <div className="mt-2 p-2 bg-muted/50 rounded-lg">
                <p className="text-[10px] font-semibold text-slate-950 mb-0.5">💡 Form Tip:</p>
                <p className="text-[10px] text-slate-950">
                  {exercise.tips}
                </p>
              </div>

              <Button
                onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtubeSearch)}`, '_blank')}
                className="mt-2 w-full text-xs h-7"
                variant="secondary"
              >
                Watch Tutorial
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
