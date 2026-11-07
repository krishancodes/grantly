import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4 p-4 rounded-2xl bg-gray-50 text-secondary-text">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-main-text mb-2">{title}</h3>
      <p className="text-sm text-secondary-text max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}
