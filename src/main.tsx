import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import UserPage from './screens/users.page.tsx';
import TodoApp from './todo/todoApp.tsx';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';

const items: MenuProps['items'] = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: <Link to={"/users"}>User</Link>,
    key: 'users',
    icon: <UserOutlined />,
  }
];

const AdminLayout = () => {
  const [current, setCurrent] = useState('mail');
  const getData = async () => {
    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: "admin@gmail.com",
        password: "123456"
      })
    })
    const d = await res.json()
    if (d.data) {
      localStorage.setItem("access_token", d.data.access_token)
    }
  }

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };
  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items} />
      <div >
        <Outlet />
      </div>
    </>
  );
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <TodoApp /> },
      {
        path: "users",
        element: <UserPage />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
