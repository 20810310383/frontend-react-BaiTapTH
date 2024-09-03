import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, theme } from "antd"

const InputSearchBook = (props) => {

    const { token } = theme.useToken();
    const [form] = Form.useForm()

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const onFinish = (values) => {
        console.log('values book: ', values);

        let query = ''
        if(values.mainText){
            query += `&mainText=/${values.mainText}/i`
        }
        if(values.author){
            query += `&author=/${values.author}/i`
        }
        if(values.category){
            query += `&category=/${values.category}/i`
        }
        if (query) {
            props.handleSearchBook(query);
        }

        console.log('query book: ', query);
    };


    return (
        <>
            <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 24}}
                            name={'mainText'}
                            label={'Tên sách'}                                                        
                        >
                            <Input placeholder="Tìm theo tên sách" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 24}}
                            name={'author'}
                            label={'Tác giả'}                                                     
                        >
                            <Input placeholder="Tìm theo tác giả"/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            labelCol={{span: 24}}
                            name={'category'}
                            label={'Thể loại'}   
                        >
                            <Input placeholder="Tìm theo thể lọai"/>
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

export default InputSearchBook