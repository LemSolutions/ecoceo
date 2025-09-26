'use client';

import { useState, useEffect } from 'react';
import { useClientDate } from '../../hooks/useClientDate';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  // Marketing
  totalCampaigns: number;
  totalLeads: number;
  totalBudget: number;
  totalSpent: number;
  
  // Progetti e Task
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  
  // Finanziario
  totalRevenue: number;
  totalFixedCosts: number;
  totalVariableCosts: number;
  monthlyBreakEven: number;
  
  // Attività Ricorrenti
  totalRecurringActivities: number;
  weeklyActivities: number;
  monthlyActivities: number;
  
  // Organizzativo
  activeUsers: number;
  conversionRate: number;
}

interface DailyActivity {
  id: string;
  type: 'task' | 'payment' | 'campaign' | 'project' | 'recurring';
  title: string;
  description: string;
  amount?: number;
  status: 'completed' | 'pending' | 'overdue';
  time: string;
  section: string;
  icon: string;
}

interface TodayPayments {
  fixedCosts: number;
  variableCosts: number;
  revenues: number;
  netFlow: number;
}

export default function DashboardTotale() {
  const [stats, setStats] = useState<DashboardStats>({
    // Marketing
    totalCampaigns: 0,
    totalLeads: 0,
    totalBudget: 0,
    totalSpent: 0,
    
    // Progetti e Task
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    
    // Finanziario
    totalRevenue: 0,
    totalFixedCosts: 0,
    totalVariableCosts: 0,
    monthlyBreakEven: 0,
    
    // Attività Ricorrenti
    totalRecurringActivities: 0,
    weeklyActivities: 0,
    monthlyActivities: 0,
    
    // Organizzativo
    activeUsers: 1,
    conversionRate: 0
  });
  
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [todayPayments, setTodayPayments] = useState<TodayPayments>({
    fixedCosts: 0,
    variableCosts: 0,
    revenues: 0,
    netFlow: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { formatDateTime } = useClientDate();

  const loadDashboardStats = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Carica dati da tutte le sezioni
      const [
        // Marketing
        campaignsResult,
        leadsResult,
        
        // Progetti e Task
        projectsResult,
        tasksResult,
        appointmentsResult,
        
        // Finanziario
        fixedCostsResult,
        variableCostsResult,
        revenuesResult,
        
        // Attività Ricorrenti
        recurringActivitiesResult,
        
        // Organizzativo
        organizationalResult
      ] = await Promise.allSettled([
        // Marketing
        supabase.from('campaigns').select('*'),
        supabase.from('leads').select('*'),
        
        // Progetti e Task
        supabase.from('task_calendar_projects').select('*'),
        supabase.from('task_calendar_tasks').select('*'),
        supabase.from('task_calendar_appointments').select('*'),
        
        // Finanziario
        supabase.from('financial_fixed_costs').select('*'),
        supabase.from('financial_variable_costs').select('*'),
        supabase.from('financial_revenues').select('*'),
        
        // Attività Ricorrenti
        supabase.from('recurring_activities').select('*'),
        
        // Organizzativo (placeholder)
        Promise.resolve({ data: [] })
      ]);

      // Estrai dati
      const campaigns = campaignsResult.status === 'fulfilled' ? campaignsResult.value.data || [] : [];
      const leads = leadsResult.status === 'fulfilled' ? leadsResult.value.data || [] : [];
      const projects = projectsResult.status === 'fulfilled' ? projectsResult.value.data || [] : [];
      const tasks = tasksResult.status === 'fulfilled' ? tasksResult.value.data || [] : [];
      const appointments = appointmentsResult.status === 'fulfilled' ? appointmentsResult.value.data || [] : [];
      const fixedCosts = fixedCostsResult.status === 'fulfilled' ? fixedCostsResult.value.data || [] : [];
      const variableCosts = variableCostsResult.status === 'fulfilled' ? variableCostsResult.value.data || [] : [];
      const revenues = revenuesResult.status === 'fulfilled' ? revenuesResult.value.data || [] : [];
      const recurringActivities = recurringActivitiesResult.status === 'fulfilled' ? recurringActivitiesResult.value.data || [] : [];

      // Calcola statistiche Marketing
      const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
      const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
      const totalLeadsCount = campaigns.reduce((sum, c) => sum + (c.leads || 0), 0);
      const conversionRate = totalLeadsCount > 0 ? (totalConversions / totalLeadsCount) * 100 : 0;

      // Calcola statistiche Progetti e Task
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending').length;

      // Calcola statistiche Finanziarie
      const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
      const totalFixedCostsAmount = fixedCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
      const totalVariableCostsAmount = variableCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
      const monthlyBreakEven = totalFixedCostsAmount + (totalVariableCostsAmount / 30);

      // Calcola statistiche Attività Ricorrenti
      const weeklyActivities = recurringActivities.filter(a => a.frequency === 'weekly').length;
      const monthlyActivities = recurringActivities.filter(a => a.frequency === 'monthly').length;

      // Calcola pagamenti di oggi
      const todayFixedCosts = fixedCosts.filter(c => 
        c.next_payment_date && c.next_payment_date.startsWith(today)
      ).reduce((sum, c) => sum + (c.amount || 0), 0);
      
      const todayVariableCosts = variableCosts.filter(c => 
        c.date && c.date.startsWith(today)
      ).reduce((sum, c) => sum + (c.amount || 0), 0);
      
      const todayRevenues = revenues.filter(r => 
        r.received_date && r.received_date.startsWith(today)
      ).reduce((sum, r) => sum + (r.amount || 0), 0);

      // Genera attività giornaliere
      const activities: DailyActivity[] = [
        // Task di oggi
        ...tasks.filter(t => t.due_date && t.due_date.startsWith(today)).map(t => ({
          id: t.id,
          type: 'task' as const,
          title: t.title,
          description: t.description || '',
          status: t.status as 'completed' | 'pending' | 'overdue',
          time: t.due_date?.split('T')[1]?.substring(0, 5) || '00:00',
          section: 'Task e Calendario',
          icon: '📅'
        })),
        
        // Appuntamenti di oggi
        ...appointments.filter(a => a.start_time && a.start_time.startsWith(today)).map(a => ({
          id: a.id,
          type: 'project' as const,
          title: a.title,
          description: a.description || '',
          status: 'pending' as const,
          time: a.start_time?.split('T')[1]?.substring(0, 5) || '00:00',
          section: 'Task e Calendario',
          icon: '📅'
        })),
        
        // Pagamenti fissi di oggi
        ...fixedCosts.filter(c => c.next_payment_date && c.next_payment_date.startsWith(today)).map(c => ({
          id: c.id,
          type: 'payment' as const,
          title: c.name,
          description: `Pagamento fisso - ${c.frequency}`,
          amount: c.amount,
          status: 'pending' as const,
          time: '09:00',
          section: 'Gestione Finanziaria',
          icon: '💰'
        })),
        
        // Entrate di oggi
        ...revenues.filter(r => r.received_date && r.received_date.startsWith(today)).map(r => ({
          id: r.id,
          type: 'payment' as const,
          title: r.name,
          description: `Entrata - ${r.category}`,
          amount: r.amount,
          status: 'completed' as const,
          time: '10:00',
          section: 'Gestione Finanziaria',
          icon: '💳'
        }))
      ].sort((a, b) => a.time.localeCompare(b.time));

      setStats({
        // Marketing
        totalCampaigns: campaigns.length,
        totalLeads: leads.length,
        totalBudget,
        totalSpent,
        
        // Progetti e Task
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        
        // Finanziario
        totalRevenue,
        totalFixedCosts: totalFixedCostsAmount,
        totalVariableCosts: totalVariableCostsAmount,
        monthlyBreakEven,
        
        // Attività Ricorrenti
        totalRecurringActivities: recurringActivities.length,
        weeklyActivities,
        monthlyActivities,
        
        // Organizzativo
        activeUsers: 1,
        conversionRate
      });

      setDailyActivities(activities);
      setTodayPayments({
        fixedCosts: todayFixedCosts,
        variableCosts: todayVariableCosts,
        revenues: todayRevenues,
        netFlow: todayRevenues - todayFixedCosts - todayVariableCosts
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Errore caricamento statistiche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const statCards = [
    // Marketing
    {
      title: 'Campagne Attive',
      value: stats.totalCampaigns,
      icon: '📊',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      section: 'Marketing'
    },
    {
      title: 'Lead Totali',
      value: stats.totalLeads,
      icon: '👥',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      section: 'Marketing'
    },
    {
      title: 'Budget Marketing',
      value: `€${stats.totalBudget.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '💳',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      section: 'Marketing'
    },
    {
      title: 'Tasso Conversione',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: '📈',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      bgGradient: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      section: 'Marketing'
    },
    
    // Progetti e Task
    {
      title: 'Progetti Attivi',
      value: stats.totalProjects,
      icon: '🚀',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      section: 'Progetti'
    },
    {
      title: 'Task Completati',
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: '✅',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      section: 'Task'
    },
    {
      title: 'Task Pendenti',
      value: stats.pendingTasks,
      icon: '⏳',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      section: 'Task'
    },
    
    // Finanziario
    {
      title: 'Ricavi Totali',
      value: `€${stats.totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '💰',
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      section: 'Finanziario'
    },
    {
      title: 'Costi Fissi',
      value: `€${stats.totalFixedCosts.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '🏠',
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      section: 'Finanziario'
    },
    {
      title: 'Break Even Mensile',
      value: `€${stats.monthlyBreakEven.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`,
      icon: '⚖️',
      color: 'teal',
      gradient: 'from-teal-500 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
      section: 'Finanziario'
    },
    
    // Attività Ricorrenti
    {
      title: 'Attività Ricorrenti',
      value: stats.totalRecurringActivities,
      icon: '🔄',
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600',
      bgGradient: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      section: 'Ricorrenti'
    },
    {
      title: 'Attività Settimanali',
      value: stats.weeklyActivities,
      icon: '📅',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      section: 'Ricorrenti'
    },
    {
      title: 'Attività Mensili',
      value: stats.monthlyActivities,
      icon: '📆',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      section: 'Ricorrenti'
    }
  ];

  return (
    <div className="space-y-6 min-h-full p-6">
      {/* Header Semplificato */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mr-3">
              <span className="text-xl text-white">📊</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Totale</h1>
              <p className="text-gray-600">Panoramica rapida delle attività di oggi</p>
            </div>
          </div>
          <button
            onClick={loadDashboardStats}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Aggiorna
              </span>
            ) : (
              '🔄 Aggiorna'
            )}
          </button>
        </div>
      </div>

      {/* Recap Pagamenti di Oggi */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">💰</span>
          Recap Pagamenti di Oggi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-600 font-medium">Costi Fissi</div>
                <div className="text-2xl font-bold text-red-800">
                  €{todayPayments.fixedCosts.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">🏠</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-600 font-medium">Costi Variabili</div>
                <div className="text-2xl font-bold text-orange-800">
                  €{todayPayments.variableCosts.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">🛒</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Entrate</div>
                <div className="text-2xl font-bold text-green-800">
                  €{todayPayments.revenues.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">💳</span>
            </div>
          </div>
          
          <div className={`bg-gradient-to-br ${todayPayments.netFlow >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200' : 'from-red-50 to-red-100 border-red-200'} rounded-lg p-4 border`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-medium ${todayPayments.netFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Flusso Netto
                </div>
                <div className={`text-2xl font-bold ${todayPayments.netFlow >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                  €{todayPayments.netFlow.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="text-2xl">{todayPayments.netFlow >= 0 ? '📈' : '📉'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attività Giornaliere */}
      <div className="bg-white/30 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">📅</span>
          Attività di Oggi
        </h2>
        {dailyActivities.length > 0 ? (
          <div className="space-y-3">
            {dailyActivities.map((activity) => (
              <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mr-4">{activity.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{activity.section}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.status === 'completed' ? 'Completato' :
                       activity.status === 'pending' ? 'In attesa' : 'In ritardo'}
                    </span>
                    {activity.amount && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded ml-2">
                        €{activity.amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">📅</span>
            <p>Nessuna attività programmata per oggi</p>
          </div>
        )}
      </div>

    </div>
  );
}
