import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { callFetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import ManageUserPage from './pages/admin/user';
import OrderPage from './pages/order';


const Layout = () => {
  return (

    <div className='layout-app'>
        <Header />
        <Outlet />
        <Footer />
    </div>
  )
}

// const LayoutAdmin = () => {
//   const isAdminRoute = window.location.pathname.startsWith('/admin');
//   const user = useSelector(state => state.account.user);
//   const userRole = user.role;

//   return (
//     <div className='layout-app'>
//       {isAdminRoute && userRole === 'ADMIN' && <Header />}
//       {/* <Header /> */}
//       <Outlet />
//       {/* <Footer /> */}
//       {isAdminRoute && userRole === 'ADMIN' && <Footer />}

//     </div>
//   )
// }


export default function App() {
  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.account.isAuthenticated)

  const getAccount = async () => {
    if (window.location.pathname === '/login'
    || window.location.pathname === '/register'
    ) return;

    const res = await callFetchAccount()
    console.log(">> check res: ", res);
    if(res && res.data){
      dispatch(doGetAccountAction(res.data))
    }
  }
  useEffect(() => {
    getAccount()
  }, [])
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,

      children: [
        {index: true, element: <Home />},
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:idBook",
          element: <BookPage />,
        },
        {
          path: "order",
          element: <OrderPage />,
        },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,

      children: [
        {
          index: true, 
          element: 
          <ProtectedRoute>
              <AdminPage />
          </ProtectedRoute>
          
        },
        {
          path: "user",
          element: 
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        },
        {
          path: "book",
          element: 
          <ProtectedRoute>
            <BookPage />
          </ProtectedRoute>
          
        },
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
      errorElement: <div>404 not found</div>,
    },
    {
      path: "/register",
      element: <RegisterPage />,
      errorElement: <div>404 not found</div>,
    },
  ]);

  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
   
    </>
  );
}
