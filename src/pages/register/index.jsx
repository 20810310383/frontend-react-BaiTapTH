import {  Button, Checkbox, Col, Divider, Form, Input, Row, notification } from "antd"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";

const RegisterPage = () => {

    const [formRegister] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const onFinish = async (values) => {
        console.log('Success:', values);
        const {fullName, email, password, phone} = values
        console.log("fullName, email, password, phone: ",fullName, email, password, phone);

        setIsLoading(true)
        const res = await callRegister(fullName, email, password, phone)
        setIsLoading(false)

        console.log("res: ", res);
        if(res.data){
            notification.success({
                message: "đăng ký người dùng",
                description: "đăng ký tài khoản thành công"
            })
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Hàm để tạo mật khẩu ngẫu nhiên
    const generateRandomPassword = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    };
    

    return (
        <Row justify="center" style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <Form     
                    form={formRegister}       
                    initialValues={{
                        remember: true,
                    }}
                    // layout='vertical'    
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <h3 style={{ textAlign: "center", color: "navy", textTransform: 'uppercase', fontSize: "20px" }}>Đăng ký tài khoản người dùng</h3>
                    <Divider />
                    <Form.Item
                        labelCol={{span: 24}}
                        label="Full Name"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập đầy đủ thông tin!',
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
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập đầy đủ thông tin!',
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
                    
                    <Form.Item>
                        <Button type="primary" onClick={() => formRegister.submit()} loading={isLoading}> Register</Button>

                        <Button style={{marginLeft: "30px"}} type="primary" danger onClick={() => {
                            console.log("check form: ", formRegister.getFieldsValue());
                            // form.getFieldsValue()
                            const randomPassword = generateRandomPassword(12); // Sinh mật khẩu với độ dài 12 ký tự
                            formRegister.setFieldsValue({
                                password: randomPassword,
                            })
                        }}>Tự tạo mật khẩu</Button>
                    </Form.Item>

                </Form> 
            </Col>
        </Row>                
    )
}

export default RegisterPage