import React from 'react';
import { motion } from 'framer-motion';
import type { DepartmentType } from '../../types/learningPath';
import { departmentData } from '../../data/departmentData';

interface DepartmentSelectorProps {
    selectedDepartment: DepartmentType;
    onSelectDepartment: (dept: DepartmentType) => void;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
    selectedDepartment,
    onSelectDepartment
}) => {
    return (
        <div className="space-y-4">
            {/* Desktop Tabs */}
            <div className="hidden md:flex gap-3 overflow-x-auto pb-2">
                {departmentData.map((dept) => (
                    <motion.button
                        key={dept.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectDepartment(dept.id)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${selectedDepartment === dept.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'glass-card text-text-primary hover:bg-white/80'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{dept.icon}</span>
                            <span>{dept.name}</span>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden">
                <select
                    value={selectedDepartment}
                    onChange={(e) => onSelectDepartment(e.target.value as DepartmentType)}
                    className="w-full px-4 py-3 rounded-2xl glass-card font-bold text-text-primary appearance-none cursor-pointer"
                >
                    {departmentData.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.icon} {dept.fullName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Department Info */}
            {departmentData.map((dept) => (
                dept.id === selectedDepartment && (
                    <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-6 rounded-2xl"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-16 h-16 rounded-2xl ${dept.color} bg-opacity-20 flex items-center justify-center text-4xl`}>
                                {dept.icon}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-text-primary mb-2">
                                    {dept.fullName}
                                </h2>
                                <p className="text-text-secondary">
                                    {dept.description}
                                </p>
                                <div className="mt-3 flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-primary">{dept.courses.length}</span>
                                        <span className="text-text-muted">Courses Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-primary">
                                            {dept.courses.reduce((sum, course) => sum + course.totalVideos, 0)}
                                        </span>
                                        <span className="text-text-muted">Total Videos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )
            ))}
        </div>
    );
};
