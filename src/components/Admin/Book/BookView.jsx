import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';



const ViewBook = (props) => {

    const {
        openDetailBook, setOpenDetailBook, dataDetailBook, setDataDetailBook
    } = props

    console.log("dataDetailBook: ", dataDetailBook);
    const onClose = () => {
        setOpenDetailBook(false);
        setDataDetailBook(null);
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (dataDetailBook) {
            let imgThumbnail = {}, imgSlider = [];
            if (dataDetailBook.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataDetailBook.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetailBook.thumbnail}`,
                }
            }
            if (dataDetailBook.slider && dataDetailBook.slider.length > 0) {
                dataDetailBook.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    })
                })
            }

            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataDetailBook])

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        setPreviewImage(file.url);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    return (
        <Drawer
            title={`Xem chi tiết sản phẩm book`}
            placement="left"
            size={'large'}
            onClose={onClose}
            open={openDetailBook}
            maskClosable={false} 
        >
            {dataDetailBook ? 
                    <>
                        <Descriptions title="Chức năng xem chi tiết" bordered column={2}>
                            <Descriptions.Item label="ID">{dataDetailBook._id}</Descriptions.Item>
                            <Descriptions.Item label="Tên sách">{dataDetailBook.mainText}</Descriptions.Item>
                            <Descriptions.Item label="Tác giả">{dataDetailBook.author}</Descriptions.Item>
                            <Descriptions.Item label="Giá tiền">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                    minimumFractionDigits: 0
                                }).format(dataDetailBook.price)}
                            </Descriptions.Item>     
                            <Descriptions.Item label="Số lượng">
                                {new Intl.NumberFormat('vi-VN').format(dataDetailBook.quantity ?? 0)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã bán">
                                {new Intl.NumberFormat('vi-VN').format(dataDetailBook.sold ?? 0)}
                            </Descriptions.Item>
                       
                            <Descriptions.Item label="Thể loại" span={2}>
                                <Badge status="processing" text={dataDetailBook.category} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">{moment(dataDetailBook.createdAt).format('DD-MM-YYYY hh:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="Ngày sửa">{moment(dataDetailBook.updatedAt).format('DD-MM-YYYY hh:mm:ss')}</Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left" > Ảnh Books </Divider>
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            showUploadList={
                                { showRemoveIcon: false }
                            }
                        >

                        </Upload>
                        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </>
                    : <p>Không có dữ liệu</p>
            }            
        </Drawer>
    )
}

export default ViewBook