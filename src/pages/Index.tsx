import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess, showError } from "@/utils/toast";
import { Sparkles } from "lucide-react";

type Habit = {
  id: string;
  name: string;
  streak: number;
  lastCompleted: Date | null;
  suggestion?: string;
};

const motivationalQuotes = [
  "The secret of getting ahead is getting started. - Mark Twain",
  "Small daily improvements are the key to staggering long-term results. - Robin Sharma",
  "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
  "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
  "Every day is a new opportunity to change your life. - Unknown",
  "The best way to predict your future is to create it. - Abraham Lincoln",
  "Discipline is choosing between what you want now and what you want most. - Unknown",
  "Your habits determine your future. - Unknown"
];

const habitSuggestions = [
  "Drink a glass of water first thing in the morning",
  "Take a 10-minute walk after meals",
  "Write down 3 things you're grateful for",
  "Read 10 pages of a book",
  "Practice deep breathing for 5 minutes",
  "Do 10 pushups",
  "Call a loved one",
  "Meditate for 5 minutes"
];

const affirmations = [
  "I am capable of achieving my goals",
  "Every day I grow stronger and more disciplined",
  "I am proud of my progress, no matter how small",
  "My habits shape my future",
  "I choose to make today count",
  "I am building a better version of myself",
  "Consistency is my superpower",
  "I celebrate every step forward"
];

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [dailyQuote, setDailyQuote] = useState("");
  const [dailyAffirmation, setDailyAffirmation] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    // Set daily quote and affirmation
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setDailyQuote(motivationalQuotes[dayOfYear % motivationalQuotes.length]);
    setDailyAffirmation(affirmations[dayOfYear % affirmations.length]);
  }, []);

  const addHabit = () => {
    if (!newHabit.trim()) {
      showError("Please enter a habit name");
      return;
    }
    
    const suggestion = habitSuggestions[Math.floor(Math.random() * habitSuggestions.length)];
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      streak: 0,
      lastCompleted: null,
      suggestion
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
          showSuccess(`🔥 Streak continues! Now at ${newStreak} days`);
        } else if (habit.lastCompleted.toDateString() !== today.toDateString()) {
          newStreak = 1;
          showSuccess("New streak started! Keep it going!");
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

  const getRandomSuggestion = () => {
    return habitSuggestions[Math.floor(Math.random() * habitSuggestions.length)];
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Habit Streak Tracker</h1>
        
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <p className="text-lg italic mb-2">"{dailyQuote}"</p>
          <p className="font-medium text-blue-600">Affirmation: {dailyAffirmation}</p>
        </div>

        <div className="flex gap-2 mb-8">
          <Input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter new habit"
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <Button onClick={addHabit}>Add Habit</Button>
        </div>

        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => setShowSuggestion(!showSuggestion)}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {showSuggestion ? "Hide Suggestions" : "Get Habit Suggestions"}
        </Button>

        {showSuggestion && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold mb-2">Habit Suggestions:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {habitSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

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
              {habit.suggestion && (
                <CardFooter className="text-sm text-gray-600">
                  💡 Suggestion: {habit.suggestion}
                </CardFooter>
              )}
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