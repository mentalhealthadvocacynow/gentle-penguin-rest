import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess } from "@/utils/toast";

type Habit = {
  id: string;
  name: string;
  streak: number;
  lastCompleted: Date | null;
};

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  const addHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      streak: 0,
      lastCompleted: null
    };
    
    setHabits([...habits, habit]);
    setNewHabit("");
    showSuccess(`Added habit: ${habit.name}`);
  };

  const completeHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let newStreak = habit.streak;
        if (!habit.lastCompleted || 
            habit.lastCompleted.toDateString() === yesterday.toDateString()) {
          newStreak++;
        } else if (habit.lastCompleted.toDateString() !== today.toDateString()) {
          newStreak = 1;
        }
        
        return {
          ...habit,
          streak: newStreak,
          lastCompleted: today
        };
      }
      return habit;
    }));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Habit Streak Tracker</h1>
        
        <div className="flex gap-2 mb-8">
          <Input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter new habit"
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <Button onClick={addHabit}>Add Habit</Button>
        </div>

        <div className="space-y-4">
          {habits.map(habit => (
            <Card key={habit.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{habit.name}</span>
                  <span className="text-lg font-medium">
                    🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`complete-${habit.id}`}
                    onCheckedChange={() => completeHabit(habit.id)}
                  />
                  <label htmlFor={`complete-${habit.id}`} className="text-sm">
                    Mark as completed today
                  </label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No habits yet. Add your first habit above!
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;