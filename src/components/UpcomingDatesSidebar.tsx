import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Users, Clock } from 'lucide-react';
import { Person } from '@/hooks/usePeople';
import { format, isToday, isTomorrow, isThisWeek, parseISO, addDays } from 'date-fns';

interface UpcomingDatesSidebarProps {
  people: Person[];
}

const UpcomingDatesSidebar: React.FC<UpcomingDatesSidebarProps> = ({ people }) => {
  // Get upcoming birthdays (next 30 days)
  const getUpcomingBirthdays = () => {
    const today = new Date();
    const next30Days = addDays(today, 30);
    
    return people
      .filter(person => person.birthday)
      .map(person => {
        const birthday = new Date(person.birthday!);
        // Set the year to current year to check if birthday is within next 30 days
        const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
        
        // If birthday has passed this year, check next year
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        return {
          person,
          date: thisYearBirthday,
          type: 'birthday' as const
        };
      })
      .filter(item => item.date <= next30Days)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Get upcoming plans (next 30 days)
  const getUpcomingPlans = () => {
    const today = new Date();
    const next30Days = addDays(today, 30);
    
    const plans = people
      .flatMap(person => 
        (person.plans_made || []).map(plan => ({
          person,
          plan,
          date: new Date(plan.date),
          type: 'plan' as const
        }))
      )
      .filter(item => {
        const planDate = item.date;
        return planDate >= today && planDate <= next30Days;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return plans;
  };

  const upcomingBirthdays = getUpcomingBirthdays();
  const upcomingPlans = getUpcomingPlans();
  const allUpcomingEvents = [...upcomingBirthdays, ...upcomingPlans]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 8); // Show only next 8 events

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const getDateBadgeVariant = (date: Date) => {
    if (isToday(date)) return 'destructive';
    if (isTomorrow(date)) return 'default';
    return 'secondary';
  };

  return (
    <Card className="h-fit sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5" />
          Dates to Remember
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {allUpcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming events</p>
          </div>
        ) : (
          allUpcomingEvents.map((event, index) => (
            <div key={index} className="p-3 rounded-lg border bg-secondary/50 hover:bg-secondary/80 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {event.type === 'birthday' ? (
                    <Gift className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm truncate">
                    {event.person.name}
                  </span>
                </div>
                <Badge 
                  variant={getDateBadgeVariant(event.date)}
                  className="text-xs flex-shrink-0"
                >
                  {getDateLabel(event.date)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                {event.type === 'birthday' 
                  ? 'Birthday' 
                  : `${event.plan.description}${event.plan.time ? ` at ${event.plan.time}` : ''}`
                }
              </p>
            </div>
          ))
        )}
        
        {(upcomingBirthdays.length > 0 || upcomingPlans.length > 0) && (
          <div className="pt-2 border-t text-xs text-muted-foreground text-center">
            {upcomingBirthdays.length} birthdays • {upcomingPlans.length} plans
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDatesSidebar;
