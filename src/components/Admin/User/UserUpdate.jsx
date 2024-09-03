import { Button, Col, Divider, Form, Input, Modal, Row, notification } from "antd"
import { useEffect, useState } from "react";
import { updateUserAPI } from "../../../services/api";

const UpdateUser =  (props) => {

    const {
        openModalUpdate, setOpenModalUpdate, fetchUsers, dataUserUpdate, setDataUserUpdate
    } = props
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        console.log("dataUserUpdate: ", dataUserUpdate);
        if(dataUserUpdate && dataUserUpdate._id){
            form.setFieldsValue({
                _id: dataUserUpdate._id,
                email: dataUserUpdate.email,
                fullName: dataUserUpdate.fullName,
                phone: dataUserUpdate.phone,
            })
        }
    }, [dataUserUpdate])

    const handleCancel = () => {
        setOpenModalUpdate(false);
        form.resetFields()
    };

    const handleUpdateUser = async (value) => {
        const {_id, fullName, email, phone} = value
        console.log("fullName, email, phone: ", _id, fullName, email, phone);

        const res = await updateUserAPI(_id, fullName, email, phone)
        console.log("res update: ", res);
        if(res.data) {
            handleCancel()
            await fetchUsers()
            notification.success({
                message: "Update user",
                description: "Cập nhật user thành công"
            })
        } else {
            notification.error({
                message: "Error update user",
                description: JSON.stringify(res.message)
            })
        }
    }

    return (
        <Modal 
                okText={"Xác nhận sửa"}
                cancelText="Huỷ"
                title="Update người dùng" 
                open={openModalUpdate} 
                onOk={() => form.submit()} 
                onCancel={handleCancel} 
                maskClosable={false}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Row gutter={16}>
                    <Col xs={24} >
                        <Form
                            form={form}
                            name="basic"
                            layout="vertical"
                            style={{
                                maxWidth: 600,
                            }}                   
                            autoComplete="off"
                            onFinish={handleUpdateUser}
                        >
                            <Form.Item
                                name="_id"
                                noStyle  
                            >
                                <Input disabled type="hidden" />
                            </Form.Item>

                            <Form.Item
                                labelCol={{span: 24}}
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },                                    
                                ]}                                
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Tên hiển thị"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên hiển thị!',
                                    },                                    
                                ]}
                            >
                            <Input />
                            </Form.Item>                                               

                            <Form.Item
                                labelCol={{span: 24}}
                                label="Số Điện Thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                    {
                                        pattern: /^0\d{9}$/,
                                        message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                                      
                        </Form>
                    </Col>
                </Row>
            </Modal>
    )
}

export default UpdateUser