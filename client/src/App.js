import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoutes from './routes/PrivateRoutes';
import { Navigate } from 'react-router-dom';
import PageContainer from './layouts/PageContainer';
import {
  CreateServiceCallForm,
  ServiceCalls,
  ServiceCallsManager,
  ServiceCall,
} from './features/serviceCalls';
import { Login, Register, useAuth } from './features/authentication';
import { Users, User, Locations, Categories, Dashboard, Practitioners } from './features/manage';
import NotFound from './pages/NotFound';
import { PractitionerServiceCalls } from './features/practitioner';
import PractitionerServiceCallView from './features/practitioner/pages/PractitionerServiceCallView';
import { Roles } from './constant';
import PractitionerNavBar from './layouts/PractitionerNavBar';

const getDefaultRoute = (type) => {
  switch (type) {
    case Roles.client:
      return '/serviceCalls';
    case Roles.manager:
      return 'dashboard';
    case Roles.practitioner:
      return 'practitioner/serviceCalls';
    default:
      return '/';
  }
};

function App() {
  const { type } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route element={<Login />} path='/login' />
        <Route element={<Register />} path='/register' />

        {/* private routes */}
        <Route element={<PrivateRoutes />}>
          <Route element={<PageContainer />}>
            <Route path='/' element={<Navigate to={getDefaultRoute(type)} replace />} />
            <Route path='/serviceCalls'>
              <Route index element={<ServiceCalls />} exact />
              <Route path=':id' element={<ServiceCall />} exact />
              <Route path='new' element={<CreateServiceCallForm />} exact />
            </Route>

            <Route element={<PrivateRoutes roles={[Roles.manager]} />}>
              <Route path='/manage'>
                <Route path='users' element={<Users />} exact />
                <Route path='users/:id' element={<User />} exact />
                <Route path='practitioners' element={<Practitioners />} exact />
                <Route path='locations' element={<Locations />} exact />
                <Route path='categories' element={<Categories />} exact />
              </Route>

              <Route path='dashboard' element={<Dashboard />} exact />
            </Route>
          </Route>

          <Route element={<PrivateRoutes roles={[Roles.practitioner]} />}>
            <Route element={<PractitionerNavBar />}>
              <Route path='/practitioner'>
                <Route path='serviceCalls' element={<PractitionerServiceCalls />} exact />
                <Route path='serviceCalls/:id' element={<PractitionerServiceCallView />} exact />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* catch all */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
