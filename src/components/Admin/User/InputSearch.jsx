import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, theme } from "antd"

const InputSearch = (props) => {

    const { token } = theme.useToken();
    const [form] = Form.useForm()

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', values);

        let query = ''
        if(values.fullName){
            query += `&fullName=/${values.fullName}/i`
        }
        if(values.email){
            query += `&email=/${values.email}/i`
        }
        if(values.phone){
            query += `&phone=/${values.phone}/i`
        }
        if (query) {
            props.handleSearch(query);
        }


    };


    return (
        <>
            <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 24}}
                            name={'fullName'}
                            label={'Name'}     
                            rules={[                               
                                {
                                    required: false,
                                    pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                    message: 'Không được nhập số!',
                                },
                            ]}                         
                        >
                            <Input placeholder="Tìm theo tên" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 24}}
                            name={'email'}
                            label={'Email'}   
                            rules={[                               
                                {
                                    type: "email",
                                    message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                  },
                            ]}                          
                        >
                            <Input placeholder="Tìm theo email"/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 24}}
                            name={'phone'}
                            label={'Số điện thoại'}   
                            rules={[                               
                                {
                                    pattern: /^0\d{9}$/,
                                    message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                  },
                            ]}                         
                        >
                            <Input placeholder="Tìm theo số điện thoại"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row >
                    <Col span={24} style={{textAlign: "right"}}>
                        <Button type="primary" htmlType="submit" size="large" icon={<SearchOutlined />}>
                            Search
                        </Button>
                        <Button 
                            style={{margin: "0 20px"}} 
                            onClick={() => {
                                form.resetFields();
                                props.setFilter("");
                            }
                            } 
                            size="large"  icon={<ClearOutlined />}>
                            Clear
                        </Button>

                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default InputSearch