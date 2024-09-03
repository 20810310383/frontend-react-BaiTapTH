import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, message, notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";
import { handleLoginSuccess } from "../../utils/axios-customize";


const LoginPage = () => {

    const [formLogin] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch()

    const onFinish  = async (values) => {

        console.log("kết quả values: ", values);
        const {username, password } = values

        setIsLoading(true)
        const res = await callLogin(username, password)
        console.log("res login:", res);

        if(res.data){
            localStorage.setItem("access_token", res.data.access_token)
            dispatch(doLoginAction(res.data.user))
            console.log("dispatch(doLoginAction(res.data.user))", dispatch(doLoginAction(res.data.user)));
            message.success("Đăng nhập thành công")
            navigate("/")
            handleLoginSuccess(res.data.access_token);
        }else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }

        setIsLoading(false)
    }

    return (
        <>
            <Row justify="center" style={{ marginTop: "30px" }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset style={{
                            padding: "15px",
                            margin: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                    }}>
                        <legend>Đăng Nhập</legend>
                        <Form
                            form={formLogin}
                            layout="vertical"
                            onFinish={onFinish} 
                        >
                            <Form.Item
                                    label="Email"
                                    name="username"
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
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Password không được để trống!',
                                        },  
                                        {
                                            required: false,
                                            pattern: new RegExp(/^(?!.*\s).{6,}$/),
                                            message: 'Không được nhập có dấu cách, tối thiểu có 6 kí tự!',
                                        },                                  
        
                                    ]}
                                >
                                <Input.Password onKeyDown={(e) => {
                                    console.log("check key: ", e.key);
                                    if(e.key === 'Enter') formLogin.submit()
                                }} />
                            </Form.Item>

                            <Form.Item >
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <Button loading={isLoading} 
                                            type="primary" 
                                            onClick={() => formLogin.submit()}>
                                        Đăng nhập 
                                    </Button>
                                    <Link to="/">Trở về trang chủ <ArrowRightOutlined /></Link>
                                </div>
                            </Form.Item>
                        </Form>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                        </div>

                    </fieldset>
                </Col>
            </Row>
        </>
    )
}

export default LoginPage