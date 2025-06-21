
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Gift, Users, Clock, Bell } from 'lucide-react';
import { Person } from '@/hooks/usePeople';
import { format, isToday, isTomorrow, isThisWeek, addDays } from 'date-fns';

interface UpcomingDatesDropdownProps {
  people: Person[];
}

const UpcomingDatesDropdown: React.FC<UpcomingDatesDropdownProps> = ({ people }) => {
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

  const totalEvents = allUpcomingEvents.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Calendar className="w-4 h-4 mr-2" />
          Upcoming
          {totalEvents > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalEvents}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto p-0 bg-white border shadow-lg z-50">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Upcoming Dates</span>
          </div>
        </div>
        <div className="p-3 space-y-3">
          {allUpcomingEvents.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No upcoming events</p>
            </div>
          ) : (
            allUpcomingEvents.map((event, index) => (
              <div key={index} className="p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {event.type === 'birthday' ? (
                      <Gift className="w-4 h-4 text-pink-500 flex-shrink-0" />
                    ) : (
                      <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
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
                <p className="text-xs text-gray-600 ml-6">
                  {event.type === 'birthday' 
                    ? 'Birthday' 
                    : event.plan.description
                  }
                </p>
              </div>
            ))
          )}
          
          {(upcomingBirthdays.length > 0 || upcomingPlans.length > 0) && (
            <div className="pt-2 border-t text-xs text-gray-500 text-center">
              {upcomingBirthdays.length} birthdays • {upcomingPlans.length} plans
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UpcomingDatesDropdown;
