'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Button } from '@/components/ui/button'
import { UpdateCard } from '@/components/UpdateCard'
import { LoadingSpinner } from '@/components/LoadingSpinner'

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

interface UpdateItem {
  id: string;
  title: string;
  content: string;
  published_at: string;
  author_id: string | null;
}

export default function DashboardPage() {
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [loadingUpdates, setLoadingUpdates] = useState(true)
  const [updatesError, setUpdatesError] = useState<string | null>(null)

  useEffect(() => {
    async function loadUpdates() {
      try {
        const response = await fetch('/mock-updates.json')
        if (!response.ok) {
          throw new Error(`Failed to load mock updates: ${response.statusText}`)
        }
        const data: UpdateItem[] = await response.json()
        setUpdates(data)
      } catch (error: any) {
        setUpdatesError(error.message)
        console.error("Error loading mock updates:", error)
      } finally {
        setLoadingUpdates(false)
      }
    }
    loadUpdates()
  }, [])

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
          <p className="text-3xl font-bold text-primary" aria-label="Total Revenue: $12,450">$12,450</p>
          <p className="text-sm text-muted-foreground mt-2" aria-label="12 percent increase from last month">+12% from last month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card p-6 rounded-lg shadow-md border"
        >
          <h2 className="text-xl font-semibold mb-4">Pending Invoices</h2>
          <p className="text-3xl font-bold text-destructive" aria-label="5 pending invoices">5</p>
          <p className="text-sm text-muted-foreground mt-2" aria-label="Totaling $3,200">Totaling $3,200</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card p-6 rounded-lg shadow-md border"
        >
          <h2 className="text-xl font-semibold mb-4">Compliance Score</h2>
          <p className="text-3xl font-bold text-green-500" aria-label="Compliance Score: 92 percent">92%</p>
          <p className="text-sm text-muted-foreground mt-2" aria-label="Good standing">Good standing</p>
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
          <ResponsiveContainer width="100%" height={300} aria-label="Monthly financial overview bar chart">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" aria-label="Month" />
              <YAxis aria-label="Amount" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
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
          <ResponsiveContainer width="100%" height={300} aria-label="Expenses by category pie chart">
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} aria-label={`Category ${entry.name}: ${entry.value}`} />
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
        {loadingUpdates ? (
          <LoadingSpinner text="Loading updates..." />
        ) : updatesError ? (
          <p className="text-destructive" role="alert">Error loading updates: {updatesError}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {updates.map((update, index) => (
              <UpdateCard
                key={update.id}
                title={update.title}
                description={update.content}
                date={new Date(update.published_at).toLocaleDateString()}
                link="#"
                delay={0.1 * index}
              />
            ))}
          </div>
        )}
        <Button className="mt-6" aria-label="View full report">View Full Report</Button>
      </motion.div>
    </div>
  )
}