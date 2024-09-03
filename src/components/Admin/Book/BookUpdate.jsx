import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { callFetchCategory, callUploadBookImg, updateBookAPI } from "../../../services/bookAPI";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';

const UpdateBook = (props) => {
    const {
        openUpdateBook, setOpenUpdateBook,
        dataUpdateBook, setDataUpdateBook,
        fetchListBook
    } = props

    const [isSubmit, setIsSubmit] = useState(false);
    const [form] = Form.useForm()
    const [listCategory, setListCategory] = useState([])

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState([])
    const [dataSlider, setDataSlider] = useState([])

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [initForm, setInitForm] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory()
            if(res && res.data){
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                console.log("d: ", d);                
                setListCategory(d);
            }
        }
        fetchCategory()
    },[])

    useEffect(() => {
        if (dataUpdateBook?._id) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdateBook.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdateBook.thumbnail}`,
                }
            ]

            const arrSlider = dataUpdateBook?.slider?.map(item => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                }
            })

            const init = {
                _id: dataUpdateBook._id,
                mainText: dataUpdateBook.mainText,
                author: dataUpdateBook.author,
                price: dataUpdateBook.price,
                category: dataUpdateBook.category,
                quantity: dataUpdateBook.quantity,
                sold: dataUpdateBook.sold,
                thumbnail: { fileList: arrThumbnail },
                slider: { fileList: arrSlider }
            }
            console.log("init: ", init);
            
            setInitForm(init);
            setDataThumbnail(arrThumbnail);
            setDataSlider(arrSlider);
            form.setFieldsValue(init);
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdateBook])

    const handleUpdateBook = async (values) => {
        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh thumbnail'
            })
            return;
        }

        if (dataSlider.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh slider'
            })
            return;
        }
        console.log("value update: ", values);
        

        const { _id, mainText, author, price, sold, quantity, category } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map(item => item.name);

        setIsSubmit(true)
        const res = await updateBookAPI(_id, thumbnail, slider, mainText, author, price, sold, quantity, category)
        if (res && res.data) {
            message.success('Cập nhật book thành công');
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([]);
            setInitForm(null);
            setOpenUpdateBook(false);
            await fetchListBook()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    }

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            //copy previous state => upload multiple images
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    }

    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const handleCancel = () => {
        setOpenUpdateBook(false);
        form.resetFields();
    }
    const onFinishFailed = () => {
        message.error("Lỗi khi click form")
    }

    return (
         <>
            <Modal 
                title="Cập nhật book"
                open={openUpdateBook} 
                onOk={() => form.submit()} 
                onCancel={handleCancel}
                okText="Xác nhận lưu"
                cancelText="Hủy"
                maskClosable={false}
                width={"50vw"}
            >
                <Divider />
                
                <Form
                    form={form}
                    name="basic"                
                    onFinish={handleUpdateBook}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"      
                    initialValues={{
                        sold: 0,  // Giá trị mặc định
                        quantity: 1
                    }}          
                >
                    <Row gutter={15}>
                        <Col hidden>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="ID"
                                name="_id"
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col span={12}>
                            <Form.Item
                                label="Tên sách"
                                name="mainText"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thông tin tên sách!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Tác giả"
                                name="author"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thông tin tác giả!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá tiền!',
                                    },
                                ]}
                            >
                                <InputNumber 
                                    formatter={value => 
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    addonAfter={"VNĐ"} 
                                    min={1} />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Thể loại"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn thể loại!',
                                    },
                                ]}
                            >
                                <Select
                                        defaultValue={null}
                                        showSearch
                                        allowClear
                                        // onChange={handleChange}
                                        options={listCategory}
                                    />

                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Số lượng"
                                name="quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng!',
                                    },
                                ]}
                            >
                                <InputNumber 
                                    style={{width: "100%"}}
                                    formatter={value => 
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    min={1} defaultValue={1} />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                label="Đã bán"
                                name="sold"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số lượng đã bán!',
                                    },
                                ]}
                            >
                                <InputNumber 
                                    style={{width: "100%"}}
                                    formatter={value => 
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    defaultValue={0} min={0} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Ảnh chính"
                                name="thumbnail"                            
                            >
                                <Upload
                                        name="thumbnail"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileThumbnail}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                        onPreview={handlePreview}
                                        defaultFileList={initForm?.thumbnail?.fileList ?? []}
                                    >
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ảnh slider"
                                name="slider"                            
                            >
                                <Upload
                                        multiple
                                        name="slider"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        customRequest={handleUploadFileSlider}
                                        beforeUpload={beforeUpload}
                                        onChange={(info) => handleChange(info, 'slider')}
                                        onRemove={(file) => handleRemoveFile(file, "slider")}
                                        onPreview={handlePreview}
                                        defaultFileList={initForm?.slider?.fileList ?? []}
                                    >
                                        <div>
                                            {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                            </Form.Item>
                        </Col>                                        
                    </Row>                
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default UpdateBook