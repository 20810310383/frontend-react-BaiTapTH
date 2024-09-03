import { Col, Divider, InputNumber, message, Popconfirm, Row } from 'antd';
import './order.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { doDeleteItemCartAction, doUpdateCartAction } from '../../redux/order/orderSlice';
import { useState } from 'react';
import { useEffect } from 'react';


const ViewOrder = (props) => {

    const carts = useSelector(state => state.order.carts);
    console.log("carts: ", carts);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();
    
    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: book, _id: book._id }))
        }
    }

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts])

    const cancel = (e) => {
        console.log(e);
        message.error('không xóa');
    };

    return (
        <div style={{background: "#e9e9e9", padding: "20px 0"}}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20,20]}>
                    <Col md={16} xs={24}>
                    {carts.map((book, index) => {
                        let giaSach = book?.detail?.price
                        console.log(`gia book ${index+1}: `, giaSach);
                        
                        return (
                            <div className='order-book'>
                                <table style={{width: "100%"}}>
                                    <tr>
                                        <td style={{width: "100px", height: "100px"}}><img width={100} height={100} src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} /></td>
                                        <td className='title'>{book?.detail?.mainText} </td>
                                        <td className='price'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(giaSach ?? 0)}
                                        </td>
                                        <td className='quantity'>
                                            <InputNumber 
                                                value={book?.quantity} 
                                                onChange={(value) => handleOnChangeInput(value, book)}
                                            />
                                        </td>
                                        <td>
                                            Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(giaSach * (book?.quantity))}
                                        </td>
                                        <td>
                                            <Popconfirm
                                                title="Xóa sản phẩm giỏ hàng"
                                                description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
                                                onConfirm={() => dispatch(doDeleteItemCartAction({_id: book._id}))}
                                                onCancel={cancel}
                                                okText="Chắc chắn xóa"
                                                cancelText="Không xóa"
                                            >
                                                <DeleteOutlined />
                                            </Popconfirm>                                                                                        
                                        </td>
                                    </tr>
                                </table>
                            </div>    
                        )
                    })}                                           
                    </Col>

                    <Col md={8} xs={24}>
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span>  Tạm tính</span>
                                <span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span> Tổng tiền</span>
                                <span className='sum-final'> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <button>Mua Hàng ({carts?.length})</button>
                        </div>
                    </Col>
                </Row>
            </div>            
        </div>
    )
}

export default ViewOrder