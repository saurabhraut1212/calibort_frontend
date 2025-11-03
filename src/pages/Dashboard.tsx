import React from "react";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 text-center px-6 py-10">
      {/* Title */}
      <motion.h2
        className="text-4xl md:text-5xl font-semibold text-indigo-700 mb-4"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome 👋 to Calibort User Management System
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-gray-600 text-base md:text-lg max-w-2xl mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Manage users efficiently — add, update, and monitor details with ease. Stay organized and
        maintain full control of your user data.
      </motion.p>

      {/* Dashboard Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        <motion.div
          className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">User Overview</h3>
          <p className="text-sm text-gray-600">
            View all registered users along with their assigned roles and account status.
          </p>
        </motion.div>

        <motion.div
          className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Manage Roles & Access</h3>
          <p className="text-sm text-gray-600">
            Assign roles such as admin or user and control access to different modules securely.
          </p>
        </motion.div>

        <motion.div
          className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Activity Monitoring</h3>
          <p className="text-sm text-gray-600">
            Track user logins, updates, and changes to ensure transparency.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
