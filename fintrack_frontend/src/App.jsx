import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { 
  LayoutDashboard, TrendingUp, Wallet, 
  ArrowUpRight, ArrowDownLeft, Loader2, 
  BarChart3, AlertCircle, RefreshCcw
} from 'lucide-react';

const App = () => {

  const [transactions, setTransactions] = useState([]);
  const [forecast, setForecast] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const addresses = [
        'http://127.0.0.1:8000',
        'http://localhost:8000'
      ];

      setLoading(true);
      setError(null);

      for (let base of addresses) {
        try {

          const [transRes, forecastRes] = await Promise.all([
            axios.get(`${base}/api/transactions/`),
            axios.get(`${base}/api/forecast/`)
              .catch(() => ({ data: { predicted_spending_next_month: 0 } }))
          ]);

          setTransactions(transRes.data);
          setForecast(forecastRes.data.predicted_spending_next_month || 0);

          setLoading(false);
          return;

        } catch (err) {
          console.error(`Failed at ${base}:`, err.message);
        }
      }

      setError("Django connection failed. Check if 'python manage.py runserver' is running on Port 8000.");
      setLoading(false);
    };

    fetchData();
  }, [refreshKey]);

  if (loading && refreshKey === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-blue-500">
        <Loader2 className="animate-spin w-12 h-12 mb-4" />
        <p className="text-slate-400 font-medium">Analyzing SQL Data & Training AI...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-sans"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              FIN<span className="text-blue-500">TRACK</span> <span className="text-slate-700">AI</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Django + Scikit-Learn Regression
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setLoading(true);
                setRefreshKey(prev => prev + 1);
              }}
              className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>

            <div className="bg-slate-900 border border-slate-800 p-2 px-4 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                SQL Connected
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-500 text-sm">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* Forecast Card */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-gradient-to-br from-blue-700 to-indigo-600 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-semibold opacity-80">
                Projected Next Month Expenses
              </p>

              <motion.h2
                key={forecast}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-7xl font-black text-white mt-2 mb-4 tracking-tighter"
              >
                ₹{Number(forecast).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </motion.h2>

              <div className="flex items-center gap-2 text-blue-100/70 text-[11px] font-bold uppercase tracking-wider">
                <TrendingUp size={14} />
                <span>Linear Regression Active</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-rows-2 gap-6">

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 flex items-center gap-5"
            >
              <BarChart3 size={24} className="text-blue-500" />
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  Total Logs
                </p>
                <h3 className="text-2xl font-bold text-white">
                  {transactions.length}
                </h3>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 flex items-center gap-5"
            >
              <Wallet size={24} className="text-emerald-500" />
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  Status
                </p>
                <h3 className="text-2xl font-bold text-white italic">
                  Synced
                </h3>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800 overflow-hidden backdrop-blur-xl">

          <div className="p-8 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white">
              Recent Transactions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-800/50">
                  <th className="px-8 py-5">Title</th>
                  <th className="px-8 py-5">Label</th>
                  <th className="px-8 py-5 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-white/[0.02] transition-all"
                    >
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-200">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                          {new Date(t.date).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="px-8 py-6">
                        <span className="bg-slate-800 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-400 uppercase">
                          {t.category_name || 'General'}
                        </span>
                      </td>

                      <td className={`px-8 py-6 text-right font-black text-lg ${t.transaction_type === 'INCOME' ? 'text-emerald-400' : 'text-slate-100'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {t.transaction_type === 'INCOME' 
                            ? <ArrowUpRight size={14}/> 
                            : <ArrowDownLeft size={14} className="text-slate-500"/>}
                          ₹{parseFloat(t.amount).toLocaleString()}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-slate-600">
                      No data found in SQL database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default App;