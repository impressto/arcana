import { WizardProvider } from './contexts/WizardContext';
import { DocumentWizard } from './components/DocumentWizard';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <WizardProvider>
        <DocumentWizard />
      </WizardProvider>
    </ToastProvider>
  );
}

export default App
