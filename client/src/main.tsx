// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SaasProvider } from '@saas-ui/react'
import { AuthProvider } from '@saas-ui/auth'
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/index.ts';
import { Provider } from 'react-redux';
import './index.css';

// library for file editing: https://ej2.syncfusion.com/react/documentation/document-editor/getting-started

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
       <SaasProvider>
       <AuthProvider>
       <Provider store={store}>
       <App />
       </Provider>
      </AuthProvider>
       </SaasProvider>
    </BrowserRouter>
  // </React.StrictMode>
  ,
);
