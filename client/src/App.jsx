import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import LoadingScreen from './components/LoadingScreen';

const HomePage = lazy(() => import('./pages/HomePage'));
const ScannerPage = lazy(() => import('./pages/ScannerPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const SharedPage = lazy(() => import('./pages/SharedPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <AppShell>
      <Suspense fallback={<LoadingScreen fullScreen label="Loading QR Share Hub" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/share/:id" element={<SharedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}

export default App;
