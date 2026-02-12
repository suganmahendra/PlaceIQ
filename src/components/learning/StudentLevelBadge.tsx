import React from 'react';
import type { StudentLevel } from '../../types/learningPath';
import { TrendingUp, Target, Rocket } from 'lucide-react';

interface StudentLevelBadgeProps {
    level: StudentLevel;
    showDescription?: boolean;
}

export const StudentLevelBadge: React.FC<StudentLevelBadgeProps> = ({
    level,
    showDescription = false
}) => {
    const levelConfig = {
        bright: {
            label: 'Advanced Level',
            emoji: '🟢',
            icon: Rocket,
            color: 'bg-green-500',
            lightColor: 'bg-green-100',
            textColor: 'text-green-700',
            borderColor: 'border-green-300',
            description: 'Concept-deep videos with fast-paced explanations and interview-oriented problems'
        },
        average: {
            label: 'Intermediate Level',
            emoji: '🟡',
            icon: Target,
            color: 'bg-yellow-500',
            lightColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            borderColor: 'border-yellow-300',
            description: 'Step-by-step explanations with balanced concept and practice approach'
        },
        weak: {
            label: 'Beginner Level',
            emoji: '🔴',
            icon: TrendingUp,
            color: 'bg-red-500',
            lightColor: 'bg-red-100',
            textColor: 'text-red-700',
            borderColor: 'border-red-300',
            description: 'Fundamentals-focused with slow-paced explanations and real-world analogies'
        }
    };

    const config = levelConfig[level];
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border-2 ${config.borderColor} ${config.lightColor}`}>
            <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
                <div className={`font-bold text-sm ${config.textColor}`}>
                    {config.label}
                </div>
                {showDescription && (
                    <div className="text-xs text-gray-600 mt-1 max-w-md">
                        {config.description}
                    </div>
                )}
            </div>
        </div>
    );
};
