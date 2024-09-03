import { Col, Divider, Form, Input, Modal, Row, notification } from "antd"
import { createUserAPI } from "../../../services/api";
import { useState } from "react";

const CreateUser = (props) => {

    const {
        openModalCreate, setOpenModalCreate, fetchUsers
    } = props
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);


    const handleCancel = () => {
        setOpenModalCreate(false);
        form.resetFields()
    };

    const handleCreateUser = async (value) => {        
        try {
            setIsSubmit(true)
            console.log("value: ", value);
            const {fullName, password, email, phone} = value
            console.log("fullName, password, email, phone: ", fullName, password, email, phone);
            const res = await createUserAPI(fullName, password, email, phone)
            if(res.data){
                handleCancel()
                await fetchUsers()
                notification.success({
                    message: "Tạo tài khoản user",
                    description: "Tạo mới tài khoản thành công!"
                })
            } else {
                notification.error({
                    message: "Lỗi Tạo tài khoản",
                    description: JSON.stringify(res.message)
                })
            }
            setIsSubmit(false)
        } catch(error){
            notification.error({
                message: "Error",
                description: error.toString()
            });
        }
    }

    return (
        <>
            <Modal 
                okText={"Xác nhận thêm mới"}
                cancelText="Huỷ"
                title="Thêm mới người dùng" 
                open={openModalCreate} 
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
                            initialValues={{
                                remember: true,
                            }}                    
                            autoComplete="off"
                            onFinish={handleCreateUser}
                        >
                            <Form.Item
                                label="Tên hiển thị"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên hiển thị!',
                                    },
                                    {
                                        required: false,
                                        pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                        message: 'Không được nhập số!',
                                    },
                                ]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu!',
                                    },
                                    {
                                        required: false,
                                        pattern: new RegExp(/^(?!.*\s).{6,}$/),
                                        message: 'Không được nhập có dấu cách, tối thiểu có 6 kí tự!',
                                    },
                                ]}
                            >
                            <Input.Password />
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
                                    {
                                        type: "email",
                                        message: 'Vui lòng nhập đúng định dạng địa chỉ email',
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
        </>
    )
}

export default CreateUser