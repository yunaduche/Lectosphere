import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Book, Bell, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type DashboardProps = {
  totalBooks: number;
};

const mockChartData = [
  { name: 'Jan', loans: 400 },
  { name: 'Feb', loans: 300 },
  { name: 'Mar', loans: 550 },
  { name: 'Apr', loans: 450 },
  { name: 'May', loans: 600 },
  { name: 'Jun', loans: 400 },
];

const Accueil: React.FC<DashboardProps> = ({ totalBooks }) => {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tableau de Bord Bibliothèque</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Circulation</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">12 actifs</div>
              <p className="text-xs text-gray-500">5 emprunts en cours</p>
              <p className="text-xs text-gray-500">7 en retard</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Catalogue</CardTitle>
              <Book className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{totalBooks} livres</div>
              <p className="text-xs text-gray-500">137 nouveautés ce mois-ci</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">2 nouvelles</div>
              <p className="text-xs text-gray-500">1 événement à venir</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 col-span-1 md:col-span-2 lg:col-span-3 border-t-4 border-indigo-500">
            <CardHeader>
              <CardTitle className="text-gray-800">Emprunts Mensuels</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#718096" />
                  <YAxis stroke="#718096" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#e2e8f0' }} />
                  <Line type="monotone" dataKey="loans" stroke="#4c51bf" strokeWidth={2} dot={{ fill: '#4c51bf' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Temps de Session</CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{formatSessionTime(sessionTime)}</div>
              <p className="text-xs text-gray-500"> ...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Accueil;