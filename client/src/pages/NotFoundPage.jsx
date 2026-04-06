import { useNavigate } from 'react-router-dom';
import ErrorState from '../components/ErrorState';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorState
      title="That page wandered off"
      description="The route you requested does not exist in QR Share Hub. Let us get you back to the main scanner flow."
      actionLabel="Back home"
      onAction={() => navigate('/')}
    />
  );
}
