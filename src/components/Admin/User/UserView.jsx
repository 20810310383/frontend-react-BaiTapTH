import { Badge, Button, Descriptions, Drawer } from "antd"
import { useState } from "react"
import moment from 'moment';

const ViewUser = (props) => {

    const {
        openDrawer, setOpenDrawer,
        dataDetail, setDataDetail,

    } = props

    const onClose = () => {
        setOpenDrawer(false);
        setDataDetail(null)
    };



    return (
        <>        
            <Drawer
                title="Chức năng xem chi tiết"
                placement="left"
                size={'large'}
                onClose={onClose}
                open={openDrawer}     
                maskClosable={false}           
            >
                {dataDetail ? 
                    <>
                        <Descriptions title="Chức năng xem chi tiết" bordered column={2}>
                            <Descriptions.Item label="ID">{dataDetail._id}</Descriptions.Item>
                            <Descriptions.Item label="Tên hiển thị">{dataDetail.fullName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{dataDetail.email}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{dataDetail.phone}</Descriptions.Item>                            
                            <Descriptions.Item label="Quyền truy cập" span={2}>
                                <Badge status="processing" text={dataDetail.role} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">{moment(dataDetail.createdAt).format('DD-MM-YYYY hh:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="Ngày sửa">{moment(dataDetail.updatedAt).format('DD-MM-YYYY hh:mm:ss')}</Descriptions.Item>
                        </Descriptions>
                    </>
                    : <p>Không có dữ liệu</p>
                }
                             

            </Drawer>

        </>
    )
}

export default ViewUser