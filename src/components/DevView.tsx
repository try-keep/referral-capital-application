import React from 'react';

interface DevViewProps {
  data: any;
  title: string;
}

const DevView: React.FC<DevViewProps> = ({ data, title }) => (
  <div className="hidden lg:block lg:col-span-2">
    <div className="bg-white rounded-lg shadow-lg p-4 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <pre className="text-xs text-gray-600 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  </div>
);

export default DevView;
