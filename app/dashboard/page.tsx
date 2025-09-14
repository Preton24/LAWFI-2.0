'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Button } from '@/app/components/ui/button'

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const pieData = [
  { name: 'Operating', value: 400 },
  { name: 'Legal Fees', value: 300 },
  { name: 'Compliance', value: 300 },
  { name: 'Marketing', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Legal Financial Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card p-6 rounded-lg shadow-md border"
        >
          <h2 className="text-xl font-semibold mb-4">Total Revenue</h2>
          <p className="text-3xl font-bold text-primary">$12,450</p>
          <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-6 rounded-lg shadow-md border"
        >
          <h2 className="text-xl font-semibold mb-4">Pending Invoices</h2>
          <p className="text-3xl font-bold text-destructive">5</p>
          <p className="text-sm text-muted-foreground mt-2">Totaling $3,200</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card p-6 rounded-lg shadow-md border"
        >
          <h2 className="text-xl font-semibold mb-4">Compliance Score</h2>
          <p className="text-3xl font-bold text-green-500">92%</p>
          <p className="text-sm text-muted-foreground mt-2">Good standing</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card p-6 rounded-lg shadow-md border"
        >
          <h2 className="text-xl font-semibold mb-4">Monthly Financial Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card p-6 rounded-lg shadow-md border"
        >
          <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-card p-6 rounded-lg shadow-md border"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity & Updates</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li>• New client onboarding for "Smith & Co." completed.</li>
          <li>• Q3 Financial Report due next week.</li>
          <li>• Upcoming regulatory changes in California tax law identified.</li>
          <li>• Automated invoice #2023005 sent to "Alpha Holdings."</li>
        </ul>
        <Button className="mt-6">View Full Report</Button>
      </motion.div>
    </div>
  )
}