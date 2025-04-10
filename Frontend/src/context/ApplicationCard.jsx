import { FiTrash2, FiLink, FiCalendar } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

export default function ApplicationCard({ application, onDelete }) {
  return (
    <div className="application-card">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{application.company}</h3>
          <p className="text-gray-600">{application.role}</p>
          <div className="flex items-center gap-2 text-gray-500">
            <FiCalendar />
            <span>{new Date(application.applicationDate).toLocaleDateString()}</span>
          </div>
          {application.link && (
            <a href={application.link} className="flex items-center gap-2">
              <FiLink /> Job Posting
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={application.status} />
          <button onClick={() => onDelete(application._id)}>
            <FiTrash2 className="text-red-600 hover:text-red-700" />
          </button>
        </div>
      </div>
    </div>
  );
}