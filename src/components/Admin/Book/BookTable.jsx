import { Button, Col, message, notification, Pagination, Popconfirm, Row, Space, Table, theme } from "antd"
import InputSearchBook from "./InputSearchBook"
import { CloudUploadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, EyeOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { callFetchBook, deleteBookAPI } from "../../../services/bookAPI";
import ViewBook from "./BookView";
import CreateBook from "./BookCreate";
import UpdateBook from "./BookUpdate";
import * as XLSX from 'xlsx';

const BookTable = () => {

    const { token } = theme.useToken();
    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
        
    };

    const [dataBook, setDataBook] = useState(null)
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loadingTable, setLoadingTable] = useState(false)
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const [openDetailBook, setOpenDetailBook] = useState(false);
    const [dataDetailBook, setDataDetailBook] = useState(null)

    const [openCreateBook, setOpenCreateBook] = useState(false);
    
    const [openUpdateBook, setOpenUpdateBook] = useState(false);
    const [dataUpdateBook, setDataUpdateBook] = useState(false);

    useEffect(() => {
        fetchListBook()
    }, [current, pageSize, filter, sortQuery])

    // dùng khi sắp xếp 
    const fetchListBook = async () => {
        setLoadingTable(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchBook(query);
        console.log("res book: ", res);
        if (res && res.data) {
            setDataBook(res.data.result);
            setTotal(res.data.meta.total)
        }
        setLoadingTable(false)
    }

    const handleDeleteBook = async (id) => {

        const res = await deleteBookAPI(id)
        if(res.data){
            notification.success({
                message: "Xóa sản phẩm book",
                description: "Bạn đã xoá thành công"
            })
            await fetchListBook()
        } else {
            notification.error({
                message: "Xoá tài khoản user",
                description: JSON.stringify(res.message)
            })
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

    const handleSearchBook = (query) => {
        setFilter(query)
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, record, index) => {
              return (
                <>
                  {(index+1) + (current - 1) * pageSize}
                </>
              )
            } 
        },        
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
        }, 
        {
            title: 'Giá tiền',
            width: "130px",
            dataIndex: 'price',
            sorter: true,
            render: (text, record) => {
                const formattedPrice = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0
                }).format(record.price);
                return <>{formattedPrice}</>;
            }
        }, 
        {
            title: 'Ngày cập nhật',
            width: "150px",
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
                            setOpenDetailBook(true)
                            setDataDetailBook(record)
                        }} 
                    />
        
                    <EditOutlined style={{color: "orange"}} onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateBook(true)
                        setDataUpdateBook(record)
                    }} /> 
        
                    <Popconfirm
                        title="Xoá book"
                        description="Bạn có chắc chắn muốn xoá?"
                        onConfirm={() => handleDeleteBook(record._id)}
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

    const handleExportData = () => {
        // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (dataBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(dataBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportBook.csv");
        }
    }

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearchBook handleSearchBook={handleSearchBook} setFilter={setFilter} />
                </Col>
                <Col span={24}>
                <div style={formStyle}>  
                        <span style={{
                                float: "left", fontSize: "18px", color: "navy", fontWeight: "bold"
                            }}>Danh sách book</span> 
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
                                type="primary" icon={<PlusOutlined />} 
                                size="large" 
                                onClick={() => {
                                    setOpenCreateBook(true)
                                }}
                            >Thêm mới</Button>
                            <Button type='ghost' onClick={() => fetchListBook()} size="large" title="Refresh">
                                <ReloadOutlined />
                            </Button>
                        </span>                                            

                        <Table
                            rowKey={"_id"} 
                            className='def'
                            columns={columns}
                            dataSource={dataBook}
                            onChange={onChange}                            
                            pagination={false}  // Tắt phân trang mặc định của Table
                            loading={loadingTable}
                            // footer={() => <div>{sortQuery ? `Sắp xếp theo: ${sortQuery}` : 'Chưa sắp xếp'}</div>}

                        />
                        
                        <ViewBook 
                            openDetailBook={openDetailBook}
                            setOpenDetailBook={setOpenDetailBook}
                            dataDetailBook={dataDetailBook}
                            setDataDetailBook={setDataDetailBook}
                        />
                        <CreateBook 
                            openCreateBook={openCreateBook}
                            setOpenCreateBook={setOpenCreateBook}
                            fetchListBook={fetchListBook}
                        />
    
                        <UpdateBook 
                            openUpdateBook={openUpdateBook}
                            setOpenUpdateBook={setOpenUpdateBook}
                            dataUpdateBook={dataUpdateBook}
                            setDataUpdateBook={setDataUpdateBook}
                            fetchListBook={fetchListBook}
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

export default BookTable