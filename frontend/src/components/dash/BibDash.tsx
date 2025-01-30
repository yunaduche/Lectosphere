import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Book, Users, Clock, AlertCircle, Library, BookOpen, BookPlus } from 'lucide-react';

// Define types for our data
type Suggestion = {
  toValidate: number;
  validatedNotConfirmed: number;
  ordered: number;
};

type Circulation = {
  totalBorrowers: number;
  expiredSubscriptions: number;
  activeLoans: number;
  delayedLoans: number;
  pendingValidation: number;
  confirmed: number;
};

type Collection = {
  totalNotices: number;
  periodicalTitles: number;
  articles: number;
};

const StatItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
    <div className={`p-2 rounded-lg ${className}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

const BibDashboard = () => {
  const suggestions: Suggestion = {
    toValidate: 0,
    validatedNotConfirmed: 0,
    ordered: 0,
  };

  const circulation: Circulation = {
    totalBorrowers: 10,
    expiredSubscriptions: 4,
    activeLoans: 5,
    delayedLoans: 5,
    pendingValidation: 0,
    confirmed: 1,
  };

  const collection: Collection = {
    totalNotices: 137,
    periodicalTitles: 7,
    articles: 9,
  };

  return (
    <div className="p-6 grid gap-6 md:grid-cols-3 animate-fadeIn">
      {/* Circulation Section */}
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-none bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-lg font-semibold text-blue-800 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Circulation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <StatItem
            icon={Users}
            label="Emprunteurs"
            value={`Total: ${circulation.totalBorrowers}`}
            className="text-blue-600 bg-blue-100"
          />
          <StatItem
            icon={AlertCircle}
            label="Abonnements expirés"
            value={circulation.expiredSubscriptions}
            className="text-blue-600 bg-blue-100"
          />
          <div className="space-y-3">
            <h3 className="font-medium flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Prêts</span>
            </h3>
            <StatItem
              icon={Book}
              label="En cours"
              value={circulation.activeLoans}
              className="text-blue-600 bg-blue-100"
            />
            <StatItem
              icon={AlertCircle}
              label="En retard"
              value={circulation.delayedLoans}
              className="text-red-600 bg-red-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Collection Section */}
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-none bg-gradient-to-br from-orange-50 to-orange-100">
        <CardHeader className="border-b border-orange-100">
          <CardTitle className="text-lg font-semibold text-orange-800 flex items-center space-x-2">
            <Library className="w-5 h-5" />
            <span>Notices</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <StatItem
            icon={BookOpen}
            label="Notices Catalogué"
            value={collection.totalNotices}
            className="text-orange-600 bg-orange-100"
          />
          <StatItem
            icon={Book}
            label="Exemplaires Bibliothèque Adulte"
            value={collection.totalNotices}
            className="text-orange-600 bg-orange-100"
          />
        </CardContent>
      </Card>

      {/* Acquisitions Section */}
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-none bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="border-b border-green-100">
          <CardTitle className="text-lg font-semibold text-green-800 flex items-center space-x-2">
            <BookPlus className="w-5 h-5" />
            <span>Acquisitions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <StatItem
            icon={Book}
            label="Existant"
            value={suggestions.toValidate}
            className="text-green-600 bg-green-100"
          />
          <StatItem
            icon={BookPlus}
            label="Nouvelles acquisitions"
            value={suggestions.toValidate}
            className="text-green-600 bg-green-100"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BibDashboard;