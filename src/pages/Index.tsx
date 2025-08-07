import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { showSuccess, showError } from "@/utils/toast";
import { Sparkles, Bookmark, Calendar, Lightbulb } from "lucide-react";

type Habit = {
  id: string;
  name: string;
  streak: number;
  lastCompleted: Date | null;
  suggestion?: string;
};

type DailyInspiration = {
  date: string;
  quote: string;
  affirmation: string;
  funFact: string;
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

const funFacts = [
  "On this day in 1997, the first Harry Potter book was published in the US",
  "The world's largest rubber duck is over 6 stories tall",
  "Bananas are berries, but strawberries aren't",
  "The shortest war in history lasted only 38 minutes (Britain vs Zanzibar, 1896)",
  "A group of flamingos is called a 'flamboyance'",
  "The inventor of the frisbee was turned into a frisbee after he died",
  "Scotland has 421 words for 'snow'",
  "The dot over the letter 'i' is called a tittle"
];

const Index = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [dailyInspiration, setDailyInspiration] = useState<DailyInspiration>({
    date: "",
    quote: "",
    affirmation: "",
    funFact: ""
  });
  const [inspirationHistory, setInspirationHistory] = useState<DailyInspiration[]>([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    const newInspiration = {
      date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      quote: motivationalQuotes[dayOfYear % motivationalQuotes.length],
      affirmation: affirmations[dayOfYear % affirmations.length],
      funFact: funFacts[dayOfYear % funFacts.length]
    };

    setDailyInspiration(newInspiration);
    
    // Add to history if not already there for today
    setInspirationHistory(prev => {
      if (prev.length === 0 || prev[0].date !== newInspiration.date) {
        return [newInspiration, ...prev].slice(0, 7); // Keep last 7 days
      }
      return prev;
    });
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

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Habit Streak Tracker</h1>
        
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{dailyInspiration.date}</span>
          </div>
          <p className="text-lg italic mb-2">"{dailyInspiration.quote}"</p>
          <p className="font-medium text-blue-600 mb-2">Affirmation: {dailyInspiration.affirmation}</p>
          <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-100">
            <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              <span className="font-medium">Fun Fact:</span> {dailyInspiration.funFact}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            {showHistory ? "Hide History" : "Show History"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowSuggestion(!showSuggestion)}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {showSuggestion ? "Hide Suggestions" : "Get Suggestions"}
          </Button>
        </div>

        {showHistory && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Inspiration History
            </h3>
            <div className="space-y-4">
              {inspirationHistory.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-gray-500">{item.date}</p>
                  <p className="text-sm italic">"{item.quote}"</p>
                  <p className="text-sm text-blue-600">Affirmation: {item.affirmation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSuggestion && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Habit Suggestions
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {habitSuggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

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