import { DownOutlined, HeartTwoTone, MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons"
import { Avatar, Button, Dropdown, Layout, Menu, Space, message, theme } from "antd"
import Sider from "antd/es/layout/Sider"
import { Content, Footer } from "antd/es/layout/layout"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { IoBookSharp } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { Link, Outlet, useNavigate } from "react-router-dom"
import { callLogout } from "../../services/api"
import './layout.scss';
import { doLogoutAction } from "../../redux/account/accountSlice"



const LayoutAdmin = () => {

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleLogout = async () => {
        const res = await callLogout()
        if(res && res.data) {
            dispatch(doLogoutAction())
            message.success("Đăng xuất thành công!")
            navigate("/")
        }
    }

    const itemsDropdown  = [
        {
          label: <label>Quản lý tài khoản</label>,
          key: 'account',
        },
        {
            label: <Link to='/' >Trang chủ web</Link>,
            key: 'home',

        },
        {
          label: <label onClick={() => handleLogout()} >Đăng xuất</label>,
          key: 'logout',
        },        
    ];

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin"
        >

            <Sider theme="dark" trigger={null} collapsible collapsed={collapsed}>
                <div style={{ height: 32, margin: 16, textAlign: 'center', borderBottom: "1px solid #ebebeb", fontWeight: "bold", color: "white" }}>
                    ADMIN
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    onClick={(e) => setActiveMenu(e.key)}
                    defaultSelectedKeys={[activeMenu]}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <MdOutlineDashboard />,
                            label: <Link to="/admin">Trang chủ</Link>
                        },
                        {
                            key: 'manage-users',
                            icon: <FaRegUser />,
                            label: 'Manage Users',
                            children: [
                                { key: 'crud', label: <Link to="/admin/user">CRUD</Link>, icon: <FaUserPen  />, },
                                { key: 'files1', label: <Link to="#trang-chu2">Files1</Link>, icon: <FaUserPen  />, },
                            ],
                        },
                        {
                            key: 'Manage-Books',
                            icon: <IoBookSharp />,
                            label: <Link to="/admin/book">Manage Books</Link>
                        },
                        {
                            key: 'Manage-Orders',
                            icon: <RiMoneyDollarCircleLine   />,
                            label: <Link to="/admin/order">Manage Orders</Link>,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <div className='admin-header' style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 15px",
                    height: "50px",
                    borderBottom: "1px solid #ebebeb"
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 40,
                        }}
                    />
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar src={urlAvatar} />{user?.fullName}
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            
                <Content style={{ 
                   margin: '24px 16px',
                   padding: 24,
                   minHeight: 1000,
                   background: colorBgContainer,
                   borderRadius: borderRadiusLG,
                }}>
                    <Outlet />
                </Content>


            </Layout>
                {/* <Footer>
                    React Test Fresher &copy; Khắc Tú - Made with <HeartTwoTone />
                </Footer> */}
        </Layout>
    )

}

export default LayoutAdmin