import { Button, Col, Pagination, Popconfirm, Row, Space, Table, message, notification, theme } from "antd"
import InputSearch from "./InputSearch";
import { useEffect, useState } from "react";
import { CloudUploadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, EyeOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { callFetchListUser, deleteUserAPI } from "../../../services/api";
import { IoMdAdd } from "react-icons/io";
import ViewUser from "./UserView";
import moment from "moment";
import CreateUser from "./UserCreate";
import UserImport from "./data/UserImport";
import * as XLSX from 'xlsx';
import UpdateUser from "./UserUpdate";


const UserPage = () => {

    const [dataUsers, setDataUsers] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loadingTable, setLoadingTable] = useState(false)
    const { token } = theme.useToken();
    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
        
    };
    const [openDrawer, setOpenDrawer] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUserUpdate, setDataUserUpdate] = useState(null);
    

    useEffect(() => {
        fetchUsers()
    }, [current, pageSize, filter, sortQuery])

    // dùng khi sắp xếp 
    const fetchUsers = async () => {
        setLoadingTable(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchListUser(query);
        if (res && res.data) {
            setDataUsers(res.data.result);
            setTotal(res.data.meta.total)
        }
        setLoadingTable(false)
    }

    // dùng khi không sắp xếp
    // useEffect(() => {
    //     fetchUsers()
    // }, [current, pageSize])

    const fetchUsers1 = async (searchFilter) => {

        setLoadingTable(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if(searchFilter){
            query += `${searchFilter}`
        }
        
        const res = await callFetchListUser(query)
        if(res && res.data){
            setDataUsers(res.data.result)
            setTotal(res.data.meta.total)            
            console.log("res user: ", res);
        }
        setLoadingTable(false)
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
            //   console.log("index: ", index+1);
              return (
                <>
                  {(index+1) + (current - 1) * pageSize}
                </>
              )
            } 
        },
        // {
        //     title: 'ID',
        //     dataIndex: '_id',
        //     key: '_id',
        //     render: (_, record) => {
        //         return (
        //         <>
        //             <a onClick={() => {
        //                 setOpenDrawer(true)
        //                 setDataDetail(record)
        //             }}>
        //                 {record._id}
        //             </a>
        //         </>
        //         )
        //     } 
        // },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            sorter: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phone',
        }, 
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{moment(record.updatedAt).format('DD-MM-YYYY hh:mm:ss')}</>
                )
            }

        }, 
        {
            title: 'Action',
            width: "150px",
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (          
                <Space size="middle">

                <EyeOutlined style={{color: "green", fontWeight: "bold", cursor: "pointer"}} 
                    onClick={() => {
                        setOpenDrawer(true)
                        setDataDetail(record)
                    }} 
                />
      
                  <EditOutlined style={{color: "orange"}} onClick={() => {
                    console.log("record update: ", record);
                    setOpenModalUpdate(true)
                    setDataUserUpdate(record)
                  }} /> 
      
                <Popconfirm
                    title="Xoá user"
                    description="Bạn có chắc chắn muốn xoá?"
                    onConfirm={() => handleDeleteUser(record._id)}
                    onCancel={cancelXoa}
                    okText="Xác nhận xoá"
                    cancelText="Không Xoá"
                  >
                    <DeleteOutlined style={{color: "red"}} />
                  </Popconfirm>
                  
                </Space>
              ),
        },        
    ];

    const handleDeleteUser = async (id) => {
        try{
            const res = await deleteUserAPI(id)
            if(res.data){
                notification.success({
                    message: "Xoá tài khoản user",
                    description: "Bạn đã xoá thành công"
                })
                await fetchUsers()
            } else {
                notification.error({
                    message: "Xoá tài khoản user",
                    description: JSON.stringify(res.message)
                })
            }

        } catch(error) {

        }        
    }

    const cancelXoa = (e) => {
        console.log(e);
        message.error('Huỷ xoá');
    };    

    // sử dụng khi dùng phân trang tại table antd
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('Pagination Change:', { pagination, filters, sorter, extra });
        
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }

    };

    // sử dụng khi phân trang bên ngoài, không dùng phân trang có sẵn của table
    const onChangePagination = (page, pageSize,  sorter = null) => {
        console.log('Pagination Change:', { page, pageSize, sorter });
 
        setCurrent(page);
        setPageSize(pageSize);

        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
    };    

    const handleSearch = (query) => {
        // fetchUsers(query)
        setFilter(query)
    }

    const handleExportData = () => {
        // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (dataUsers.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(dataUsers);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.csv");
        }
    }


    return (
       <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} setFilter={setFilter}  />
                </Col>
                <Col span={24}>
                    <div style={formStyle}>  
                        <span style={{
                                float: "left", fontSize: "18px", color: "navy", fontWeight: "bold"
                            }}>Danh sách tài khoản user</span> 
                        <span style={{                            
                            float: "right",
                            marginBottom: "10px"
                        }}>                            
                            <Button 
                                style={{margin: "0 5px"}} 
                                type="primary" 
                                icon={<ExportOutlined />} 
                                size="large" 
                                onClick={() => handleExportData()}
                            >  Export</Button>
                            <Button 
                                style={{margin: "0 5px"}} 
                                type="primary" 
                                icon={<CloudUploadOutlined />} 
                                size="large" 
                                onClick={() => {
                                    setOpenModalImport(true)
                                }}
                            >Import</Button>
                            <Button 
                                style={{margin: "0 5px"}} 
                                type="primary" icon={<PlusOutlined />} 
                                size="large" 
                                onClick={() => {
                                    setOpenModalCreate(true)
                                }}
                            >Thêm mới</Button>
                            <Button type='ghost' onClick={() => fetchUsers()} size="large" title="Refresh">
                                <ReloadOutlined />
                            </Button>
                        </span>
                        
                        <CreateUser 
                            openModalCreate={openModalCreate} 
                            setOpenModalCreate={setOpenModalCreate}
                            fetchUsers={fetchUsers}
                        />
                        <UserImport 
                            setOpenModalImport={setOpenModalImport}
                            openModalImport={openModalImport}
                            fetchUsers={fetchUsers}
                        />
                        <UpdateUser 
                            openModalUpdate={openModalUpdate} 
                            setOpenModalUpdate={setOpenModalUpdate}
                            fetchUsers={fetchUsers}
                            dataUserUpdate={dataUserUpdate}
                            setDataUserUpdate={setDataUserUpdate}
                        />

                        <Table
                            rowKey={"_id"} 
                            className='def'
                            columns={columns}
                            dataSource={dataUsers}
                            onChange={onChange}
                            // pagination={{
                            //     current: current,
                            //     pageSize: pageSize,
                            //     showSizeChanger: true,
                            //     total: total,
                            //     showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                            // }}
                            pagination={false}  // Tắt phân trang mặc định của Table
                            loading={loadingTable}
                            // footer={() => <div>{sortQuery ? `Sắp xếp theo: ${sortQuery}` : 'Chưa sắp xếp'}</div>}

                        />
                        <ViewUser                             
                            openDrawer={openDrawer}
                            setOpenDrawer={setOpenDrawer}
                            dataDetail={dataDetail}
                            setDataDetail={setDataDetail}
                        />
                        <br />
                        <Pagination 
                            style={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                            current={current}
                            pageSize={pageSize}
                            total={total}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} tài khoản</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        />
                    </div>                                        
                </Col>
            </Row>
       </>
    )
}

export default UserPage